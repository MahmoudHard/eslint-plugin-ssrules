/**
 * @fileoverview Checks for the use of bad hashing algorithms that have been shown to collide
 * @author Jeremy Buis
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: 'Checks for the use of bad hashing algorithms that have been shown to collide',
            category: 'Security',
            recommended: false
        },
        fixable: 'code', // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ]
    },

    create: function (context) {
    // variables should be defined here

        // bad hash algorithms
        const hashMap = {
            'md5': 'MD5',
            'sha1': 'SHA1'
        };

        // ----------------------------------------------------------------------
        // Helpers
        // ----------------------------------------------------------------------

        /**
         * Checks to see if a MemberExpression"s node is `createHash` or
         * `crypto.createHash`.
         * @param {ASTNode} calleeNode The callee node to evaluate.
         * @returns {boolean} True if the callee is `createHash` or `crypto.createHash`,
         * false otherwise.
         */
        function isCreateHash (node) {
            return (
                node.type === 'MemberExpression' &&
                !node.computed &&
                node.property.type === 'Identifier' &&
                node.property.name === 'createHash'
            );
        }

        // ----------------------------------------------------------------------
        // Public
        // ----------------------------------------------------------------------

        return {

            'CallExpression': function (node) {
                const hashName = hashMap[node.arguments[0].value];

                if (isCreateHash(node.callee) &&
                    hashName &&
                    node.arguments[0].type === 'Literal'
                ) {
                    context.report({
                        'node': node,
                        'message': '{{hashName}} is a weak hash algorithm with collisions.',
                        'data': {
                            'hashName': hashName
                        },
                        'fix': function() {
                            return null;
                        }
                    });
                }
            }
        };
    }
};