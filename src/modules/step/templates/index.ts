import type { WelcomeUser } from "@modules/welcome/entities/user.entity";

const stepUnlockedString = (unlockedSteps: number[]) => (unlockedSteps.length > 0 ? `Vous avez maintenant accès ${unlockedSteps.length > 1 ? "aux étapes" : "à l'étape"} n°${unlockedSteps.map(s => s + 1).join(", ")} sur l'application Welcome.` : `Vous aurez prochainement accès aux differentes étapes de l'application Welcome.`);

const stepTemplate = (user: WelcomeUser, unlockedSteps: number[]) => `<html lang="fr">
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>
    <p>
      Bonjour ${user.firstName},<br /><br />
      ${stepUnlockedString(unlockedSteps)}<br /><br />
      Cordialement.
    </p>
  </body>
</html>`;

const welcomeTemplate = (user: WelcomeUser, unlockedSteps: number[]) => `<html lang="fr">
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>
    <p>
      Bonjour ${user.firstName},<br /><br />
      Félicitation pour votre recrutement !<br />
      Afin de faciliter votre intégration, nous avons mis en place une application vous permettant de découvrir en profondeur notre entreprise.<br /><br />
      ${stepUnlockedString(unlockedSteps)}<br /><br />
      Cordialement.
    </p>
  </body>
</html>`;

export { stepTemplate, welcomeTemplate };