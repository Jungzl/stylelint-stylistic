import stylelint from 'stylelint'

const { createPlugin, utils, rules } = stylelint

const { ruleMessages, validateOptions, whitespaceChecker } = utils
const { selectorCombinatorSpaceChecker } = rules

const ruleName = 'stylistic/selector-combinator-space-before'

const messages = ruleMessages(ruleName, {
  expectedBefore: (combinator) => `Expected single space before "${combinator}"`,
  rejectedBefore: (combinator) => `Unexpected whitespace before "${combinator}"`,
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/selector-combinator-space-before',
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

    selectorCombinatorSpaceChecker({
      root,
      result,
      locationChecker: checker.before,
      locationType: 'before',
      checkedRuleName: ruleName,
      fix: context.fix
        ? (combinator) => {
          if (primary === 'always') {
            combinator.spaces.before = ' '

            return true
          }

          if (primary === 'never') {
            combinator.spaces.before = ''

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
