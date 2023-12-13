import { createPlugin, utils, rules } from 'stylelint'

const { ruleMessages, validateOptions, whitespaceChecker } = utils
const { selectorCombinatorSpaceChecker } = rules

const ruleName = 'stylistic/selector-combinator-space-after'

const messages = ruleMessages(ruleName, {
  expectedAfter: (combinator) => `Expected single space after "${combinator}"`,
  rejectedAfter: (combinator) => `Unexpected whitespace after "${combinator}"`,
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/selector-combinator-space-after',
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
      locationChecker: checker.after,
      locationType: 'after',
      checkedRuleName: ruleName,
      fix: context.fix
        ? (combinator) => {
          if (primary === 'always') {
            combinator.spaces.after = ' '

            return true
          }

          if (primary === 'never') {
            combinator.spaces.after = ''

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
export default { messages, meta, plugin: createPlugin(ruleName, rule), rule, ruleName }
