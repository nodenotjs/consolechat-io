class UserProfile {
    constructor(associatedUserId, nickname) {
        this._associatedUserId = associatedUserId;
        this.nickname = nickname
    }

    get userId() { return this._associatedUserId }
}

class ProfilesCache {
    constructor() {
        this._profiles = new Map()
    }

    addProfile(profile) {
        this._profiles.set(profile.userid, profile)
    }

    removeProfile(id) {
        this._profiles.remove(id)
    }

    getProfileById(id) {
        return this._profiles.get(id)
    }

    getHasProfileById(id) {
        return this._profiles.has(id)
    }
}