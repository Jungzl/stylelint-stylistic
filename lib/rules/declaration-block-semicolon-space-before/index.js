import stylelint from 'stylelint'

const { createPlugin, utils } = stylelint

const { blockString, getDeclarationValue, report, ruleMessages, setDeclarationValue, validateOptions, whitespaceChecker, typeGuards: { isAtRule, isRule } } = utils

const ruleName = 'stylistic/declaration-block-semicolon-space-before'

const messages = ruleMessages(ruleName, {
  expectedBefore: () => 'Expected single space before ";"',
  rejectedBefore: () => 'Unexpected whitespace before ";"',
  expectedBeforeSingleLine: () => 'Expected single space before ";" in a single-line declaration block',
  rejectedBeforeSingleLine: () => 'Unexpected whitespace before ";" in a single-line declaration block',
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/declaration-block-semicolon-space-before',
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

    root.walkDecls((decl) => {
      // Ignore last declaration if there's no trailing semicolon
      const parentRule = decl.parent

      if (!parentRule) throw new Error('A parent node must be present')

      if (!isAtRule(parentRule) && !isRule(parentRule)) {
        return
      }

      if (!parentRule.raws.semicolon && parentRule.last === decl) {
        return
      }

      const declString = decl.toString()

      checker.before({
        source: declString,
        index: declString.length,
        lineCheckStr: blockString(parentRule),
        err: (m) => {
          if (context.fix) {
            const value = getDeclarationValue(decl)

            if (primary.startsWith('always')) {
              if (decl.important) {
                decl.raws.important = ' !important '
              } else {
                setDeclarationValue(decl, value.replace(/\s*$/, ' '))
              }

              return
            }

            if (primary.startsWith('never')) {
              if (decl.raws.important) {
                decl.raws.important = decl.raws.important.replace(/\s*$/, '')
              } else {
                setDeclarationValue(decl, value.replace(/\s*$/, ''))
              }

              return
            }
          }

          report({
            message: m,
            node: decl,
            index: decl.toString().length - 1,
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
