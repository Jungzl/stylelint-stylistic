import stylelint from 'stylelint'

const { createPlugin, utils } = stylelint

const { functionCommaSpaceChecker, fixer, ruleMessages, validateOptions, whitespaceChecker } = utils

const ruleName = 'stylistic/function-comma-newline-before'

const messages = ruleMessages(ruleName, {
  expectedBefore: () => 'Expected newline before ","',
  expectedBeforeMultiLine: () => 'Expected newline before "," in a multi-line function',
  rejectedBeforeMultiLine: () => 'Unexpected whitespace before "," in a multi-line function',
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/function-comma-newline-before',
  fixable: true,
}

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
  const checker = whitespaceChecker('newline', primary, messages)

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: ['always', 'always-multi-line', 'never-multi-line'],
    })

    if (!validOptions) {
      return
    }

    functionCommaSpaceChecker({
      root,
      result,
      locationChecker: checker.beforeAllowingIndentation,
      checkedRuleName: ruleName,
      fix: context.fix
        ? (div, index, nodes) => fixer({
          div,
          index,
          nodes,
          expectation: primary,
          position: 'before',
          symb: context.newline || '',
        })
        : null,
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
rule.meta = meta
export default createPlugin(ruleName, rule)
