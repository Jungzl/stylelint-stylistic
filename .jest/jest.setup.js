import { getTestRule,getTestRuleConfigs } from 'jest-preset-stylelint'
import failOnConsole from 'jest-fail-on-console'

global.testRule = getTestRule({ plugins: ['../lib/main.js'] })

failOnConsole({ shouldFailOnWarn: true })
