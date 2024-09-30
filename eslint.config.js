const ESLINT_CONFIGS_CONFIG = require("./configs/eslint/flat-configs/eslint-configs-config");
const ESLINT_GLOBAL_CONFIG = require("./configs/eslint/flat-configs/eslint.global-config");
const { OFF } = require("./configs/eslint/eslint.constants");
const ESLINT_TYPESCRIPT_CONFIG = require("./configs/eslint/flat-configs/eslint.typescript-config");
const ESLINT_CONSTANTS_CONFIG = require("./configs/eslint/flat-configs/eslint.constants-config");
const ESLINT_DTO_CONFIG = require("./configs/eslint/flat-configs/eslint.dto-config");
const ESLINT_SCHEMAS_CONFIG = require("./configs/eslint/flat-configs/eslint.schemas-config");
const ESLINT_PIPES_CONFIG = require("./configs/eslint/flat-configs/eslint.pipes-config");
const ESLINT_DECORATORS_CONFIG = require("./configs/eslint/flat-configs/eslint.decorators-config");
const ESLINT_TESTS_CONFIG = require("./configs/eslint/flat-configs/eslint.tests-config");
const ESLINT_FACTORIES_CONFIG = require("./configs/eslint/flat-configs/eslint.factories-config");
const ESLINT_SERVICES_CONFIG = require("./configs/eslint/flat-configs/eslint.services-config");
const ESLINT_CONTROLLERS_CONFIG = require("./configs/eslint/flat-configs/eslint.controllers-config");
const ESLINT_REPOSITORIES_CONFIG = require("./configs/eslint/flat-configs/eslint.repositories-config");
const ESLINT_STYLISTIC_CONFIG = require("./configs/eslint/flat-configs/eslint.stylistic-config");

module.exports = [
  {
    name: "global-linter-options",
    linterOptions: { reportUnusedDisableDirectives: OFF },
  },
  ESLINT_GLOBAL_CONFIG,
  ESLINT_CONFIGS_CONFIG,
  ESLINT_TYPESCRIPT_CONFIG,
  ESLINT_STYLISTIC_CONFIG,
  ESLINT_CONSTANTS_CONFIG,
  ESLINT_DTO_CONFIG,
  ESLINT_SCHEMAS_CONFIG,
  ESLINT_PIPES_CONFIG,
  ESLINT_DECORATORS_CONFIG,
  ESLINT_TESTS_CONFIG,
  ESLINT_FACTORIES_CONFIG,
  ESLINT_SERVICES_CONFIG,
  ESLINT_REPOSITORIES_CONFIG,
  ESLINT_CONTROLLERS_CONFIG,
];