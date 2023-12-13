import { createPlugin, utils, rules } from 'stylelint'

const { ruleMessages, validateOptions, whitespaceChecker } = utils
const { valueListCommaWhitespaceChecker } = rules

const ruleName = 'stylistic/value-list-comma-newline-before'

const messages = ruleMessages(ruleName, {
  expectedBefore: () => 'Expected newline before ","',
  expectedBeforeMultiLine: () => 'Expected newline before "," in a multi-line list',
  rejectedBeforeMultiLine: () => 'Unexpected whitespace before "," in a multi-line list',
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/value-list-comma-newline-before',
}

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
  const checker = whitespaceChecker('newline', primary, messages)

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: ['always', 'always-multi-line', 'never-multi-line'],
    })

    if (!validOptions) {
      return
    }

    valueListCommaWhitespaceChecker({
      root,
      result,
      locationChecker: checker.beforeAllowingIndentation,
      checkedRuleName: ruleName,
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
rule.meta = meta
export default { messages, meta, plugin: createPlugin(ruleName, rule), rule, ruleName }
