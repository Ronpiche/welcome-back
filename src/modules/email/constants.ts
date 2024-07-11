export const EMAIL_FROM = 'noreply@localhost';
export const STEP_EMAIL_SUBJECT = 'Nouvelle étape disponible';
export const STEP_EMAIL_TEXT = `<html lang="fr">
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>
    <p>
      Bonjour {USER},<br />
      Vous avez maintenant accès à l'étape n°{STEP} sur l'application Welcome.
    </p>
    <p>
      Cordialement.
    </p>
  </body>
</html>`;
