import stylelint from 'stylelint'

const { createPlugin, utils } = stylelint

const { declarationValueIndex, ruleMessages, validateOptions, whitespaceChecker, declarationColonSpaceChecker } = utils

const ruleName = 'stylistic/declaration-colon-space-before'

const messages = ruleMessages(ruleName, {
  expectedBefore: () => 'Expected single space before ":"',
  rejectedBefore: () => 'Unexpected whitespace before ":"',
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/declaration-colon-space-before',
  fixable: true,
}

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
  const checker = whitespaceChecker('space', primary, messages)

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: ['always', 'never'],
    })

    if (!validOptions) {
      return
    }

    declarationColonSpaceChecker({
      root,
      result,
      locationChecker: checker.before,
      checkedRuleName: ruleName,
      fix: context.fix
        ? (decl, index) => {
          const colonIndex = index - declarationValueIndex(decl)
          const { between } = decl.raws

          if (between == null) throw new Error('`between` must be present')

          if (primary === 'always') {
            decl.raws.between = between.slice(0, colonIndex).replace(/\s*$/, ' ') + between.slice(colonIndex)

            return true
          }

          if (primary === 'never') {
            decl.raws.between = between.slice(0, colonIndex).replace(/\s*$/, '') + between.slice(colonIndex)

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
