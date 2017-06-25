const ucword = word => word[0].toUpperCase() + word.slice(1);

/**
 * Titleize a tag by adding spaces and capitalizing words.
 *
 * @param   {String}    str   Tag to titleize
 * @returns {String}    Titleized phrase
 */
module.exports = str => str.replace('/', '').split(/[-_ ]+/g).map(ucword).join(' ');
