<?php
header('Content-Type: application/json; charset=utf-8');
$mysqli = new mysqli("localhost","root","","db_alumnoss");
if($mysqli->connect_errno){ echo json_encode(["error"=>"DB_CONN_FAILED"]); exit; }
@$mysqli->set_charset("utf8mb4");
function all($res){ $out=[]; while($r=$res->fetch_assoc()) $out[]=$r; return $out; }
$action = $_GET['action'] ?? 'get_all';
$input = json_decode(file_get_contents("php://input"), true) ?? [];
function esc($v){ global $mysqli; return $mysqli->real_escape_string($v); }

if($action=='get_all'){
  $instituciones = all($mysqli->query("SELECT * FROM instituciones"));
  $profesores = all($mysqli->query("SELECT * FROM profesores"));
  $aulas = all($mysqli->query("SELECT a.*, p.nombre as profesor_name, p.apellido as profesor_apellido FROM aulas a LEFT JOIN profesores p ON a.profesor_id=p.id"));
  $materias = all($mysqli->query("SELECT * FROM materias"));
  $aula_materia = all($mysqli->query("SELECT * FROM aula_materia"));
  $alumnos = all($mysqli->query("SELECT * FROM alumnos"));
  $pruebas = all($mysqli->query("SELECT * FROM pruebas"));
  $notas = all($mysqli->query("SELECT * FROM notas"));
  echo json_encode([
    "instituciones"=>$instituciones,
    "profesores"=>$profesores,
    "aulas"=>$aulas,
    "materias"=>$materias,
    "aula_materia"=>$aula_materia,
    "alumnos"=>$alumnos,
    "pruebas"=>$pruebas,
    "notas"=>$notas
  ]);
  exit;
}

if($action=='add_institucion'){
  $n=esc($input['nombre']); $d=esc($input['direccion']); $c=esc($input['correo']); $l=esc($input['localidad']);
  $mysqli->query("INSERT INTO instituciones(nombre,direccion,correo,localidad) VALUES('{$n}','{$d}','{$c}','{$l}')");
  echo json_encode(["ok"=>1]); exit;
}

if($action=='add_profesor'){
  $n=esc($input['nombre']); $a=esc($input['apellido']); $dni=esc($input['dni']); 
  $inst=intval($input['institucion_id']??0); $esp=esc($input['especialidad']??'');
  
  // Validar DNI único
  $check = $mysqli->query("SELECT id FROM profesores WHERE dni='{$dni}'");
  if($check && $check->num_rows > 0){
    echo json_encode(["ok"=>0, "error"=>"DNI ya existe"]); exit;
  }
  
  $mysqli->query("INSERT INTO profesores(nombre,apellido,dni,institucion_id,especialidad) VALUES('{$n}','{$a}','{$dni}',{$inst},'{$esp}')");
  echo json_encode(["ok"=>1]); exit;
}

if($action=='add_materia'){
  $n=esc($input['nombre']);
  $mysqli->query("INSERT INTO materias(nombre) VALUES('{$n}')");
  echo json_encode(["ok"=>1]); exit;
}

if($action=='add_aula'){
  $n=esc($input['nombre']); $g=esc($input['grado']); $inst=intval($input['institucion_id']); $prof=intval($input['profesor_id']);
  $mysqli->query("INSERT INTO aulas(nombre,grado,institucion_id,profesor_id) VALUES('{$n}','{$g}',{$inst},".($prof? $prof:"NULL").")");
  echo json_encode(["ok"=>1]); exit;
}

if($action=='add_alumno'){
  $n=esc($input['nombre']); $a=esc($input['apellido']); $dni=esc($input['dni']); $edad=intval($input['edad']); $gen=esc($input['genero']); $aula=intval($input['aula_id']);
  
  // Validar DNI único
  $check = $mysqli->query("SELECT id FROM alumnos WHERE dni='{$dni}'");
  if($check && $check->num_rows > 0){
    echo json_encode(["ok"=>0, "error"=>"DNI ya existe"]); exit;
  }
  
  $row = $mysqli->query("SELECT institucion_id FROM aulas WHERE id={$aula}")->fetch_assoc();
  $inst = $row ? intval($row['institucion_id']) : "NULL";
  $mysqli->query("INSERT INTO alumnos(nombre,apellido,dni,edad,genero,aula_id,institucion_id) VALUES('{$n}','{$a}','{$dni}',{$edad},'{$gen}',{$aula},{$inst})");
  echo json_encode(["ok"=>1]); exit;
}

if($action=='add_prueba'){
  $am=intval($input['aula_materia_id']); $nom=esc($input['nombre']); $fecha=esc($input['fecha']); $peso=floatval($input['peso']);
  $mysqli->query("INSERT INTO pruebas(aula_materia_id,nombre,fecha,peso) VALUES({$am},'{$nom}','{$fecha}',{$peso})");
  echo json_encode(["ok"=>1]); exit;
}

if($action=='add_nota'){
  $pr=intval($input['prueba_id']); $al=intval($input['alumno_id']); $nota=floatval($input['nota']);
  $mysqli->query("INSERT INTO notas(prueba_id,alumno_id,nota) VALUES({$pr},{$al},{$nota})");
  echo json_encode(["ok"=>1]); exit;
}

if($action=='add_aula_materia'){
  $aula=intval($input['aula_id']); $mat=intval($input['materia_id']); $prof=intval($input['profesor_id']);
  
  // Validar que no exista ya esta combinación
  $check = $mysqli->query("SELECT id FROM aula_materia WHERE aula_id={$aula} AND materia_id={$mat}");
  if($check && $check->num_rows > 0){
    echo json_encode(["ok"=>0, "error"=>"Esta materia ya está asignada a esta aula"]); exit;
  }
  
  $mysqli->query("INSERT INTO aula_materia(aula_id,materia_id,profesor_id) VALUES({$aula},{$mat},".($prof? $prof:"NULL").")");
  echo json_encode(["ok"=>1]); exit;
}

// Listar aula_materia de un aula específica
if($action=='get_aula_materias' && isset($_GET['aula_id'])){
  $aula=intval($_GET['aula_id']);
  $sql = "SELECT am.*, m.nombre as materia_nombre, p.nombre as profesor_nombre, p.apellido as profesor_apellido 
          FROM aula_materia am 
          JOIN materias m ON am.materia_id = m.id 
          LEFT JOIN profesores p ON am.profesor_id = p.id 
          WHERE am.aula_id = {$aula}";
  $res = all($mysqli->query($sql));
  echo json_encode($res); exit;
}

if($action=='get_notas_alumno' && isset($_GET['id'])){
  $id=intval($_GET['id']);
  $res = all($mysqli->query("SELECT n.*, p.nombre as prueba_nombre, am.materia_id FROM notas n JOIN pruebas p ON n.prueba_id=p.id JOIN aula_materia am ON p.aula_materia_id=am.id WHERE n.alumno_id={$id}"));
  echo json_encode($res); exit;
}

if($action=='get_estadisticas'){
  $where_alumno = [];
  $where_prueba = [];
  if(isset($_GET['institucion_id']) && $_GET['institucion_id']!=='') $where_alumno[] = "al.institucion_id=".intval($_GET['institucion_id']);
  if(isset($_GET['aula_id']) && $_GET['aula_id']!=='') $where_alumno[] = "al.aula_id=".intval($_GET['aula_id']);
  if(isset($_GET['dni']) && $_GET['dni']!=='') $where_alumno[] = "al.dni='".$mysqli->real_escape_string($_GET['dni'])."'";
  if(isset($_GET['q']) && $_GET['q']!==''){
    $q_raw = $_GET['q'];
    $q = $mysqli->real_escape_string($q_raw);
    $cond = "(al.dni LIKE '%$q%' OR al.nombre LIKE '%$q%' OR al.apellido LIKE '%$q%'";
    if(ctype_digit($q_raw)) $cond .= " OR al.id=".intval($q_raw);
    $cond .= ")";
    $where_alumno[] = $cond;
  }
  if(isset($_GET['materia_id']) && $_GET['materia_id']!=='') $where_prueba[] = "am.materia_id=".intval($_GET['materia_id']);
  if(isset($_GET['profesor_id']) && $_GET['profesor_id']!=='') $where_prueba[] = "am.profesor_id=".intval($_GET['profesor_id']);

  $w_al = count($where_alumno)? "WHERE ".implode(" AND ", $where_alumno): "";
  $conds_notes = array_merge($where_alumno, $where_prueba);
  $w_notes = count($conds_notes)? "WHERE ".implode(" AND ", $conds_notes): "";

  $res = $mysqli->query("SELECT ROUND(AVG(al.edad),2) as prom FROM alumnos al {$w_al}");
  $prom_edad = $res->fetch_assoc()['prom'];

  $sql = "SELECT n.nota, m.nombre as materia, al.id as alumno_id FROM notas n 
    JOIN pruebas p ON n.prueba_id=p.id 
    JOIN aula_materia am ON p.aula_materia_id=am.id 
    JOIN materias m ON am.materia_id=m.id
    JOIN alumnos al ON n.alumno_id=al.id
    {$w_notes}";
  $res2 = $mysqli->query($sql);
  $rows = all($res2);

  $notas = array_map(function($r){ return floatval($r['nota']); }, $rows);
  $prom_notas = count($notas)? round(array_sum($notas)/count($notas),2): null;
  $max_nota = count($notas)? max($notas): null;
  $min_nota = count($notas)? min($notas): null;

  $gen_sql = "SELECT genero,COUNT(*) as cantidad FROM alumnos al {$w_al} GROUP BY genero";
  $gen = all($mysqli->query($gen_sql));

  $pm_sql = "SELECT m.nombre as materia, ROUND(AVG(n.nota),2) as promedio FROM notas n JOIN pruebas p ON n.prueba_id=p.id JOIN aula_materia am ON p.aula_materia_id=am.id JOIN materias m ON am.materia_id=m.id JOIN alumnos al ON n.alumno_id=al.id {$w_notes} GROUP BY m.id";
  $pm = all($mysqli->query($pm_sql));

  echo json_encode([
    "prom_edad"=>$prom_edad,
    "prom_notas"=>$prom_notas,
    "nota_alta"=>$max_nota,
    "nota_baja"=>$min_nota,
    "generos"=>$gen,
    "promedios_por_materia"=>$pm
  ]);
  exit;
}

if($action=='delete_institucion' && isset($_GET['id'])){ $mysqli->query("DELETE FROM instituciones WHERE id=".intval($_GET['id'])); echo json_encode(["ok"=>1]); exit; }
if($action=='delete_aula' && isset($_GET['id'])){ $mysqli->query("DELETE FROM aulas WHERE id=".intval($_GET['id'])); echo json_encode(["ok"=>1]); exit; }
if($action=='delete_alumno' && isset($_GET['id'])){ $mysqli->query("DELETE FROM alumnos WHERE id=".intval($_GET['id'])); echo json_encode(["ok"=>1]); exit; }

// Nuevos delete para entidades faltantes
if($action=='delete_profesor' && isset($_GET['id'])){ $mysqli->query("DELETE FROM profesores WHERE id=".intval($_GET['id'])); echo json_encode(["ok"=>1]); exit; }
if($action=='delete_materia' && isset($_GET['id'])){ $mysqli->query("DELETE FROM materias WHERE id=".intval($_GET['id'])); echo json_encode(["ok"=>1]); exit; }
if($action=='delete_prueba' && isset($_GET['id'])){ $mysqli->query("DELETE FROM pruebas WHERE id=".intval($_GET['id'])); echo json_encode(["ok"=>1]); exit; }
if($action=='delete_nota' && isset($_GET['id'])){ $mysqli->query("DELETE FROM notas WHERE id=".intval($_GET['id'])); echo json_encode(["ok"=>1]); exit; }
if($action=='delete_aula_materia' && isset($_GET['id'])){ $mysqli->query("DELETE FROM aula_materia WHERE id=".intval($_GET['id'])); echo json_encode(["ok"=>1]); exit; }

// Update endpoints
if($action=='update_institucion' && isset($_GET['id'])){
  $id = intval($_GET['id']);
  $n=esc($input['nombre']??''); $d=esc($input['direccion']??''); $c=esc($input['correo']??''); $l=esc($input['localidad']??'');
  $ok = $mysqli->query("UPDATE instituciones SET nombre='{$n}', direccion='{$d}', correo='{$c}', localidad='{$l}' WHERE id={$id}");
  echo json_encode(["ok"=> $ok?1:0]); exit;
}

if($action=='update_profesor' && isset($_GET['id'])){
  $id = intval($_GET['id']);
  $n=esc($input['nombre']??''); $a=esc($input['apellido']??''); $dni=esc($input['dni']??'');
  $inst=intval($input['institucion_id']??0); $esp=esc($input['especialidad']??'');
  
  // Validar DNI único (excepto el mismo registro)
  $check = $mysqli->query("SELECT id FROM profesores WHERE dni='{$dni}' AND id != {$id}");
  if($check && $check->num_rows > 0){
    echo json_encode(["ok"=>0, "error"=>"DNI ya existe"]); exit;
  }
  
  $ok = $mysqli->query("UPDATE profesores SET nombre='{$n}', apellido='{$a}', dni='{$dni}', institucion_id={$inst}, especialidad='{$esp}' WHERE id={$id}");
  echo json_encode(["ok"=> $ok?1:0]); exit;
}

if($action=='update_materia' && isset($_GET['id'])){
  $id = intval($_GET['id']); $n=esc($input['nombre']??'');
  $ok = $mysqli->query("UPDATE materias SET nombre='{$n}' WHERE id={$id}");
  echo json_encode(["ok"=> $ok?1:0]); exit;
}

if($action=='update_aula' && isset($_GET['id'])){
  $id = intval($_GET['id']);
  $n=esc($input['nombre']??''); $g=esc($input['grado']??''); $inst=intval($input['institucion_id']??0); $prof = isset($input['profesor_id']) && $input['profesor_id']!=='' ? intval($input['profesor_id']) : null;
  $prof_sql = is_null($prof) ? "NULL" : $prof;
  $ok = $mysqli->query("UPDATE aulas SET nombre='{$n}', grado='{$g}', institucion_id={$inst}, profesor_id={$prof_sql} WHERE id={$id}");
  echo json_encode(["ok"=> $ok?1:0]); exit;
}

if($action=='update_alumno' && isset($_GET['id'])){
  $id = intval($_GET['id']);
  $n=esc($input['nombre']??''); $a=esc($input['apellido']??''); $dni=esc($input['dni']??''); $edad=intval($input['edad']??0); $gen=esc($input['genero']??''); $aula=intval($input['aula_id']??0);
  
  // Validar DNI único (excepto el mismo)
  $check = $mysqli->query("SELECT id FROM alumnos WHERE dni='{$dni}' AND id != {$id}");
  if($check && $check->num_rows > 0){
    echo json_encode(["ok"=>0, "error"=>"DNI ya existe"]); exit;
  }
  
  $row = $mysqli->query("SELECT institucion_id FROM aulas WHERE id={$aula}")->fetch_assoc();
  $inst = $row ? intval($row['institucion_id']) : "NULL";
  $ok = $mysqli->query("UPDATE alumnos SET nombre='{$n}', apellido='{$a}', dni='{$dni}', edad={$edad}, genero='{$gen}', aula_id={$aula}, institucion_id={$inst} WHERE id={$id}");
  echo json_encode(["ok"=> $ok?1:0]); exit;
}

if($action=='update_prueba' && isset($_GET['id'])){
  $id = intval($_GET['id']);
  $nom=esc($input['nombre']??''); $fecha=esc($input['fecha']??''); $peso=floatval($input['peso']??0);
  $ok = $mysqli->query("UPDATE pruebas SET nombre='{$nom}', fecha='{$fecha}', peso={$peso} WHERE id={$id}");
  echo json_encode(["ok"=> $ok?1:0]); exit;
}

echo json_encode(["error"=>"unknown_action"]);
?>