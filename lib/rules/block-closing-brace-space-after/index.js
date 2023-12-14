import stylelint from 'stylelint'

const { createPlugin, utils } = stylelint

const { blockString, hasBlock, rawNodeString, report, ruleMessages, validateOptions, whitespaceChecker } = utils

const ruleName = 'stylistic/block-closing-brace-space-after'

const messages = ruleMessages(ruleName, {
  expectedAfter: () => 'Expected single space after "}"',
  rejectedAfter: () => 'Unexpected whitespace after "}"',
  expectedAfterSingleLine: () => 'Expected single space after "}" of a single-line block',
  rejectedAfterSingleLine: () => 'Unexpected whitespace after "}" of a single-line block',
  expectedAfterMultiLine: () => 'Expected single space after "}" of a multi-line block',
  rejectedAfterMultiLine: () => 'Unexpected whitespace after "}" of a multi-line block',
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/block-closing-brace-space-after',
}

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
  const checker = whitespaceChecker('space', primary, messages)

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [
        'always',
        'never',
        'always-single-line',
        'never-single-line',
        'always-multi-line',
        'never-multi-line',
      ],
    })

    if (!validOptions) {
      return
    }

    // Check both kinds of statements: rules and at-rules
    root.walkRules(check)
    root.walkAtRules(check)

    /**
     * @param {import('postcss').Rule | import('postcss').AtRule} statement
     */
    function check(statement) {
      const nextNode = statement.next()

      if (!nextNode) {
        return
      }

      if (!hasBlock(statement)) {
        return
      }

      let reportIndex = statement.toString().length
      let source = rawNodeString(nextNode)

      // Skip a semicolon at the beginning, if any
      if (source && source.startsWith(';')) {
        source = source.slice(1)
        reportIndex += 1
      }

      checker.after({
        source,
        index: -1,
        lineCheckStr: blockString(statement),
        err: (msg) => {
          report({
            message: msg,
            node: statement,
            index: reportIndex,
            result,
            ruleName,
          })
        },
      })
    }
  }
}

rule.ruleName = ruleName
rule.messages = messages
rule.meta = meta
export default createPlugin(ruleName, rule)
