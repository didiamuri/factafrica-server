// # EN
// accesses a variable inside of process.env, throwing an error if it's not found
// always run this method in advance. (i.e. upon initialisation) so that the error is thrown as early as possible
// caching the values improuves performance - accessing process.env many time is bad 

// # FR
// accède à une variable à l'intérieur de process.env, en lançant une erreur si elle n'est pas trouvée
// toujours exécuter cette méthode à l'avance. (c'est-à-dire lors de l'initialisation) afin que l'erreur soit lancée le plus tôt possible
// la mise en cache des valeurs améliore les performances - l'accès à process.env est souvent mauvais 

// By Didierson AMURI, 2021, Congo-Kinshasa

const cache = {};

const accessEnv = (key, defaultValue) => {
    if (!(key in process.env)) {
        if (defaultValue) return defaultValue;
        throw new Error(`${key} not found in process.env !`);
    }

    if (cache[key]) return cache[key];

    cache[key] = process.env[key];

    return process.env[key];
};

export default accessEnv;