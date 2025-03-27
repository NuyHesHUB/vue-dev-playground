const environment = {
    profile: import.meta.env.VITE_APP_ENV as string
} as const;

const _matchesProfile = (...profiles: string[]):boolean => {
    for(const profile of profiles) {
        if(environment.profile === profile) {
            return true;
        }
    }

    return false;
}

export {
    _matchesProfile as matchesProfile,
}

export default environment;