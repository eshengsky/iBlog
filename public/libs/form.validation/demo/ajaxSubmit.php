<?php
$userName = $_POST['username'];

echo json_encode(array(
    'message' => sprintf('Welcome %s', $userName),
));
