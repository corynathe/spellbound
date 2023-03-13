
export const DEFINITIONS = {};

export async function getDictionaryEntry(origWord) {
    const word = origWord?.trim().toLowerCase();
    if (isStrEmpty(word)) return undefined;

    // return fast if already in cache
    if (DEFINITIONS[word]) return DEFINITIONS[word];

    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const result = await response.json();
    const data = result?.[0];
    // console.log(word, data);

    if (!data) {
        DEFINITIONS[word] = {};
    } else {
        // get the first definition with an example, fall back to the first definition if none have examples
        let definitions = [];
        data.meanings?.forEach(m => definitions = definitions.concat(m.definitions));
        const defWithExample = definitions.filter(d => !isStrEmpty(d.example));
        const definition = defWithExample.length ? defWithExample[0] : definitions[0];

        const audios = data.phonetics?.map(p => p.audio).filter(p => p !== undefined && p !== null && p !== '');
        const audiosUS = audios?.filter(a => a.toLowerCase().endsWith('-us.mp3'));
        const audio = audiosUS.length ? audiosUS[0] : (audios.length ? audios[0] : undefined);

        DEFINITIONS[word] = { definition, audio };
    }

    return DEFINITIONS[word];
}

export function isStrEmpty(value) {
    return value === undefined || value === null || value === '';
}

export function getValidWords(words) {
    return words?.map(w => w.trim()).filter(w => !isStrEmpty(w)) || [];
}

export function playAudio(word, audioFile) {
    setTimeout(() => {
        if (audioFile) {
            new Audio(audioFile).play();
        } else if (window.speechSynthesis) {
            const speech = new SpeechSynthesisUtterance(word);
            window.speechSynthesis.speak(speech);
        }
    }, 200);
}

export function splitWordListId(id) {
    const user = id?.split('|')[0];
    const listId = id?.split('|')[1] || getNextUserListId(user);
    return { user: isValidUser(user) ? user : undefined, listId: parseInt(listId, 10) };
}

function getNextUserListId(user) {
    if (!isValidUser(user)) return undefined;

    let i = 0;
    while (localStorage.getItem(userListId(user, i)) !== null) {
        i++;
    }
    return i;
}

export function userListId(user, listId) {
    if (!isValidUser(user)) return undefined;
    return user + '|' + listId;
}

export function getStorageUsers() {
    const usersJSON = localStorage.getItem('users');
    return usersJSON ? JSON.parse(usersJSON) : {};
}

function isValidUser(user) {
    if (!user) return undefined;
    const users = getStorageUsers();
    return users[user] !== undefined;
}

export function getStorageWordList(id, useDefaults) {
    const json = localStorage.getItem(id);
    if (json) {
        // TODO add function to trim and remove any blanks
        const parseJSON = JSON.parse(json);
        const name = parseJSON.name || '';
        const words = getValidWords(parseJSON.words);

        words.forEach(word => getDictionaryEntry(word));
        return { name, words };
    } else if (useDefaults) {
        return { name: '', words: [] };
    }
    return undefined;
}

export function addUser() {
    const users = getStorageUsers();
    const userIds = Object.keys(users).sort();
    const lastId = userIds.length > 0 ? parseInt(userIds[userIds.length - 1]) : 0;
    const userId = lastId + 1;
    users[userId + ''] = newUserDetails(userId);
    saveStorageUsers(users);
    return userId;
}

export function removeUser(user) {
    const users = getStorageUsers();
    if (users[user]?.lists) {
        users[user]?.lists.forEach(listId => {
            removeStorageWordList(user, listId);
        });
    }
    delete users[user];
    saveStorageUsers(users);
}

export function saveUserName(userId, name) {
    const users = getStorageUsers();
    if (users[userId]) {
        const _name = name?.trim() ?? '';
        users[userId].name = _name.length > 0 ? _name : getDefaultName(userId);
    }
    saveStorageUsers(users);
}

function newUserDetails(userId) {
    return { name: getDefaultName(userId), lists: [] };
}

export function getDefaultName(userId) {
    return 'Spell Master #' + userId;
}

export function saveUser(userId, listId, remove = false) {
    const users = getStorageUsers();
    if (!users[userId]) {
        users[userId] = newUserDetails(userId);
    }
    if (!users[userId].lists) {
        users[userId].lists = [];
    }
    if (remove) {
        const removeIndex = users[userId].lists.indexOf(listId);
        if (removeIndex > -1) {
            users[userId].lists.splice(removeIndex, 1);
        }
    } else if (users[userId].lists.indexOf(listId) === -1) {
        users[userId].lists.push(listId);
    }
    saveStorageUsers(users);
}

function saveStorageUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

export function saveStorageWordList(id, name, words) {
    localStorage.setItem(id, JSON.stringify({
        name,
        words: getValidWords(words),
    }));

    // also need to update the users object
    const { user, listId } = splitWordListId(id);
    saveUser(user, listId);
}

export function removeStorageWordList(user, listId) {
    const id = userListId(user, listId);
    localStorage.removeItem(id);

    // also need to update the users object
    saveUser(user, listId, true);
}
