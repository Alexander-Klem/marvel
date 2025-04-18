import { Component } from 'react';
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';

class CharList extends Component {

    state = {
        characters: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 0,
        charactersEnded: false
    }


    marvelService = new MarvelService();

    componentDidMount() { 
        this.onRequest();
    }

    onRequest = (offset) => { 
        this.onCharacterListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharactersLoaded)
            .catch(this.onError)
    }

    onCharacterListLoading = () => { 
        this.setState({
            newItemLoading: true,
        })
    }

    onCharactersLoaded = (newCharacters) => { 

        let ended = false;
        if (newCharacters.length < 3) { 
            ended = true;
        }

        this.setState(({offset, characters}) => ({
            characters: [...characters, ...newCharacters],
            loading: false,
            newItemLoading: false,
            offset: offset + 6,
            charactersEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    itemRefs = [];

    setInputRef = elem => {
        this.itemRefs.push(elem);
    }

    focusFirstItem = (id) => { 
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'))
        this.itemRefs[id - 1].classList.add('char__item_selected');
    }


    renderCharacters = (arr) => { 
        const items = arr.map(item => { 
            return (
                <li className="char__item"
                    ref={this.setInputRef}
                    tabIndex={0}
                    key={item.id}
                    onClick={() => {
                        this.props.onCharacterSelected(item.id);
                        this.focusFirstItem(item.id)
                    }}>
                    <img src={item.thumbnail} alt={item.name} />
                    <div className="char__name">{item.name}</div>
                </li>
            );
        })

        return (
            <ul className="char__grid">
                {items}
            </ul>
        );
    }

    render() { 

        const { characters, loading, error, offset, newItemLoading, charactersEnded } = this.state;
        const items = this.renderCharacters(characters);

        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? items : null;

      
    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charactersEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}
}

CharList.propTypes = {
    onCharacterSelected: PropTypes.func
}

export default CharList;
