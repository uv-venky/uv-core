import fs from 'node:fs';
import yaml from 'js-yaml';
import { DEFAULT_APP_ID, DEFAULT_JWT_EXPIRES_IN, DEFAULT_MIGRATIONS_DIR } from './constants.js';
const parsers = {
    number: (value) => {
        const result = Number(value);
        if (Number.isNaN(result)) {
            throw new Error('Value is not a number');
        }
        return result;
    },
    boolean: (value) => {
        if (value === 'true') {
            return true;
        }
        if (value === 'false') {
            return false;
        }
        throw new Error('Value is not a boolean');
    },
};
function isObject(obj) {
    return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}
function setPath(object, pathParts, value) {
    if (value === null || pathParts.length === 0) {
        return;
    }
    if (pathParts.length === 1) {
        object[pathParts[0]] = value;
        return;
    }
    const nextKey = pathParts[0];
    if (!Object.hasOwn(object, nextKey)) {
        object[nextKey] = {};
    }
    setPath(object[nextKey], pathParts.slice(1), value);
}
function parseString(value, format) {
    if (format === 'number') {
        return parsers.number(value);
    }
    if (format === 'boolean') {
        return parsers.boolean(value);
    }
    throw new Error('Unknown format');
}
function substituteDeep(substitutionMap, variables) {
    const result = {};
    function walk(map, vars, pathTo) {
        for (const prop in map) {
            const value = map[prop];
            if (typeof value === 'string') {
                if (typeof vars[value] !== 'undefined' && vars[value] !== '') {
                    setPath(result, pathTo.concat(prop), vars[value]);
                }
            }
            else if (isObject(value)) {
                const name = value.__name;
                const format = value.__format;
                if (name && format && typeof vars[name] !== 'undefined' && vars[name] !== '') {
                    try {
                        setPath(result, pathTo.concat(prop), parseString(vars[name], format));
                    }
                    catch (error) {
                        const err = error;
                        err.message = `__format parser error in ${value.__name}: ${err.message}`;
                        throw err;
                    }
                }
                else {
                    walk(value, vars, pathTo.concat(prop));
                }
            }
            else {
                throw new Error(`Illegal key type for substitution map at ${pathTo.join('.')}: ${typeof value}`);
            }
        }
    }
    walk(substitutionMap, variables, []);
    return result;
}
function deepCopy(target, source) {
    for (const key in source) {
        if (!Object.hasOwn(source, key)) {
            continue;
        }
        if (typeof source[key] === 'object' && source[key] !== null) {
            if (Array.isArray(source[key])) {
                target[key] = [];
            }
            else if (!isObject(target[key])) {
                target[key] = {};
            }
            deepCopy(target[key], source[key]);
        }
        else {
            target[key] = source[key];
        }
    }
}
function loadYaml(name) {
    return yaml.load(fs.readFileSync(`./config/${name}.yml`, 'utf8'));
}
function loadConfigFile(name) {
    if (process.env.NODE_ENV !== 'test') {
        console.info(`Loading config for ${name}`);
    }
    if (!fs.existsSync('./config/default.yml')) {
        throw new Error(`${name}: No default config found!`);
    }
    const doc = loadYaml('default');
    const nodeEnv = process.env.NODE_ENV;
    if (nodeEnv && fs.existsSync(`./config/${nodeEnv}.yml`)) {
        deepCopy(doc, loadYaml(nodeEnv));
    }
    if (fs.existsSync('./config/local.yml')) {
        deepCopy(doc, loadYaml('local'));
    }
    if (fs.existsSync('./config/env.yml')) {
        deepCopy(doc, substituteDeep(loadYaml('env'), process.env));
    }
    const config = doc;
    config.appId = config.appId || DEFAULT_APP_ID;
    config.jwtExpiresIn = config.jwtExpiresIn || DEFAULT_JWT_EXPIRES_IN;
    config.migrationsDir = config.migrationsDir || DEFAULT_MIGRATIONS_DIR;
    return config;
}
let config;
export function getConfig(_name = 'app') {
    if (!config) {
        config = loadConfigFile(_name);
    }
    return config;
}
export function loadConfig(_name = 'app') {
    config = loadConfigFile(_name);
    return config;
}
export function configure(overrides) {
    config = {
        ...getConfig(),
        ...overrides,
        init: {
            ...getConfig().init,
            ...overrides.init,
            admin: {
                ...getConfig().init.admin,
                ...overrides.init?.admin,
            },
        },
    };
    return config;
}
export function resetConfigForTests() {
    config = undefined;
}
//# sourceMappingURL=config.js.map