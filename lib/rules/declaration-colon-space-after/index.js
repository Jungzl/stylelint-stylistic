import stylelint from 'stylelint'

const { createPlugin, utils } = stylelint

const { declarationValueIndex, ruleMessages, validateOptions, whitespaceChecker, declarationColonSpaceChecker } = utils

const ruleName = 'stylistic/declaration-colon-space-after'

const messages = ruleMessages(ruleName, {
  expectedAfter: () => 'Expected single space after ":"',
  rejectedAfter: () => 'Unexpected whitespace after ":"',
  expectedAfterSingleLine: () => 'Expected single space after ":" with a single-line declaration',
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/declaration-colon-space-after',
  fixable: true,
}

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
  const checker = whitespaceChecker('space', primary, messages)

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: ['always', 'never', 'always-single-line'],
    })

    if (!validOptions) {
      return
    }

    declarationColonSpaceChecker({
      root,
      result,
      locationChecker: checker.after,
      checkedRuleName: ruleName,
      fix: context.fix
        ? (decl, index) => {
          const colonIndex = index - declarationValueIndex(decl)
          const { between } = decl.raws

          if (between == null) throw new Error('`between` must be present')

          if (primary.startsWith('always')) {
            decl.raws.between = between.slice(0, colonIndex) + between.slice(colonIndex).replace(/^:\s*/, ': ')

            return true
          }

          if (primary === 'never') {
            decl.raws.between = between.slice(0, colonIndex) + between.slice(colonIndex).replace(/^:\s*/, ':')

            return true
          }

          return false
        }
        : null,
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
rule.meta = meta
export default createPlugin(ruleName, rule)
