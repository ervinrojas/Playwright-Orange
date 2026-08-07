const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key];
    
    // If the environment variable is not set, we check if a default value is provided. If not, we throw an error to ensure that critical variables are not missing.
    if (!value) {
        // If there is a default value allowed (like the URL), use it
        if (defaultValue !== undefined) {
            return defaultValue;
        }
            // @ts-ignore - VS Code cannot read .env files during static analysis
            throw new Error('CRITICAL: Environment variable ' + key + ' is missing. Check your .env file.');
    }
    return value;
};

export const Environment = Object.freeze({
    // URLs - has a default value, so it's optional in the .env file
    BASE_URL: getEnv('BASE_URL', 'https://opensource-demo.orangehrmlive.com'),

    // Admin Credentials - Required
    ADMIN_USERNAME: getEnv('ADMIN_USERNAME'),
    ADMIN_PASSWORD: getEnv('ADMIN_PASSWORD'),

    // Employee Credentials - Required
    EMPLOYEE_USERNAME: getEnv('EMPLOYEE_USERNAME'),
    EMPLOYEE_PASSWORD: getEnv('EMPLOYEE_PASSWORD'),
});