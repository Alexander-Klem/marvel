class MarvelService { 
    _apiBase = 'https://marvel-server-zeta.vercel.app/';
    _apiKey = 'apikey=d4eecb0c66dedbfae4eab45d312fc1df';
    _baseOffset = 0;

    getResource = async(url) => { 
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${res}, status ${res.status}`)
        }

        return await res.json();
    }

    getAllCharacters = async (offset = this._baseOffset) => { 
        const res = await this.getResource(`${this._apiBase}characters?limit=6&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(this._transformCharacter);
    }

    getCharacter = async (id) => { 
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformCharacter(res.data.results[0])
    }

    _transformCharacter = (character) => { 
        return {
            id: character.id,
            name: character.name,
            description: character.description ? `${character.description.slice(0, 42)}... follow for more in (HOMEPAGE)` : 'There is no description for this character' ,
            thumbnail: character.thumbnail.path + `.` + character.thumbnail.extension,
            homepage: character.urls[0].url,
            wiki: character.urls[1].url,
            comics: character.comics.items,
        }
    }
}

export default MarvelService;