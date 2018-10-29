<?php

// configure
$from = sprintf('From: %s <%s>', $_POST['name'], $_POST['email']);
$sendTo = 'Website <decentraledelft@gmail.com>';
$subject =  sprintf('%s - %s reservering bij De Centrale', $_POST['date'], $_POST['time']);
$fields = array('date' => 'Datum', 'time' => 'Tijd', 'number' => 'Aantal', 'message' => 'Message', 'name' => 'Name',  'phone' => 'Phone', 'email' => 'Email', ); // array variable name => Text to appear in email
$okMessage = 'Je bericht is verstuurd. We gaan kijken of we een plekje hebben en nemen dan zo snel mogelijk contact met je op.';
$errorMessage = 'Er ging iets fout tijdens het sturen van dit formulier. Probeer het later nog eens of bel ons op 015 889 27 77.';
// let's do the sending
$mailSend = true;
$responseArray = array('type' => 'success', 'message' => $okMessage);


try {
    $emailText = "Een nieuwe reservering: \n\n";
    foreach ($_POST as $key => $value) {

        if (isset($fields[$key])) {
            $emailText .= "$fields[$key]: $value\n";
        }
    }

    $mailSend = mail($sendTo, $subject, $emailText, $from);

   // if ($mailSend) { 
   //      $mailSendCustomer = mail($from, $subject);
   //  }
} catch (Exception $e) {
    $mailSend = false;
}

if (!$mailSend) {
    $responseArray = array('type' => 'danger', 'message' => $errorMessage);
}


header('Content-Type: application/json');
echo json_encode($responseArray);