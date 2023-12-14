// eslint-disable-next-line import/no-extraneous-dependencies
import fg from 'fast-glob'

const entries = fg.sync(['**/index.js'], { dot: true })

// console.log(entries)

const rules = {
  get 'at-rule-name-case'() {
    return import('./at-rule-name-case/index.js').then((m) => m.default);
  },
}

export default rules
