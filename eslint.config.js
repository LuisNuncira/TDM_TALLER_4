import globals from "globals";

export default [
    {
        ignores: ["public/css/**"]
    },
    {
        files: ["src/**/*.js"],
        languageOptions: {
            globals: globals.node,
            sourceType: "module"
        }
    },
    {
        files: ["public/js/**/*.js"],
        languageOptions: {
            globals: globals.browser,
            sourceType: "module"
        }
    }
];