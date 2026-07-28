// User-supplied search terms are interpolated into MongoDB `$regex` queries.
// Mongo compiles those with PCRE-ish semantics, so a term such as `mac (` is an
// invalid pattern and makes the driver throw -> 500 from the API. Escaping every
// metacharacter turns the term back into a plain literal substring match.

const REGEX_METACHARACTERS = /[.*+?^${}()|[\]\\]/g;

const escapeRegex = (value) => {
  if (typeof value !== 'string') return '';
  return value.replace(REGEX_METACHARACTERS, '\\$&');
};

module.exports = { escapeRegex };
