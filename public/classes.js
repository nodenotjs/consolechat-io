class UserProfile {
    constructor(associatedUserId, nickname) {
        this._associatedUserId = associatedUserId
        this.nickname = nickname
    }

    get userId() { return this._associatedUserId }
}

class ProfilesCache {
    constructor() {
        this._profiles = new Map()
        this._myprofileid = -1
    }

    setProfile(profile) {
        this._profiles.set(profile.userid, profile)
    }

    removeProfile(id) {
        this._profiles.delete(id)
    }

    getProfile(id) {
        return this._profiles.get(id)
    }

    getHasProfile(id) {
        return this._profiles.has(id)
    }

    setMyProfileId(id) {
        this._myprofileid = id
    }

    getMyProfile() {
        return this.getProfile(this.myprofile)
    }
}