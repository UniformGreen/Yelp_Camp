// functie pentru a injecta try catch mai usor in orice functie async

module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}