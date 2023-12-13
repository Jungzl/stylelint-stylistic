import { createPlugin, utils } from 'stylelint'

const { functionCommaSpaceChecker, fixer, ruleMessages, validateOptions, whitespaceChecker } = utils

const ruleName = 'stylistic/function-comma-space-after'

const messages = ruleMessages(ruleName, {
  expectedAfter: () => 'Expected single space after ","',
  rejectedAfter: () => 'Unexpected whitespace after ","',
  expectedAfterSingleLine: () => 'Expected single space after "," in a single-line function',
  rejectedAfterSingleLine: () => 'Unexpected whitespace after "," in a single-line function',
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/function-comma-space-after',
  fixable: true,
}

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
  const checker = whitespaceChecker('space', primary, messages)

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: ['always', 'never', 'always-single-line', 'never-single-line'],
    })

    if (!validOptions) {
      return
    }

    functionCommaSpaceChecker({
      root,
      result,
      locationChecker: checker.after,
      checkedRuleName: ruleName,
      fix: context.fix
        ? (div, index, nodes) => fixer({
          div,
          index,
          nodes,
          expectation: primary,
          position: 'after',
          symb: ' ',
        })
        : null,
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
rule.meta = meta
export default { messages, meta, plugin: createPlugin(ruleName, rule), rule, ruleName }
