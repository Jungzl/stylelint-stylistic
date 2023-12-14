import stylelint from 'stylelint'

const { createPlugin, utils } = stylelint

const { hasBlock, isStandardSyntaxAtRule, rawNodeString, report, ruleMessages, validateOptions, whitespaceChecker } = utils

const ruleName = 'stylistic/at-rule-semicolon-space-before'

const messages = ruleMessages(ruleName, {
  expectedBefore: () => 'Expected single space before ";"',
  rejectedBefore: () => 'Unexpected whitespace before ";"',
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/at-rule-semicolon-space-before',
}

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
  const checker = whitespaceChecker('space', primary, messages)

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: ['always', 'never'],
    })

    if (!validOptions) {
      return
    }

    root.walkAtRules((atRule) => {
      if (hasBlock(atRule)) {
        return
      }

      if (!isStandardSyntaxAtRule(atRule)) {
        return
      }

      const nodeString = rawNodeString(atRule)

      checker.before({
        source: nodeString,
        index: nodeString.length,
        err: (m) => {
          report({
            message: m,
            node: atRule,
            index: nodeString.length - 1,
            result,
            ruleName,
          })
        },
      })
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
rule.meta = meta
export default createPlugin(ruleName, rule)
