import { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import MarvelService from '../../services/MarvelService';

import './charInfo.scss';

class CharInfo extends Component {

    state = {
        character: null,
        loading: false,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() { 
        this.updateCharacter();
    }

    componentDidUpdate(prevProps) { 
        if (this.props.characterId !== prevProps.characterId) { 
            this.updateCharacter(); 
        }
    }

    updateCharacter = () => { 
        const { characterId } = this.props;
        if (!characterId) {
            return;
        }

        this.onCharacterLoading();
        this.marvelService.getCharacter(characterId)
            .then(this.onCharacterLoaded)
            .catch(this.onError);
        
        
    }

    onCharacterLoaded = (character) => { 
        this.setState({
            character,
            loading: false,
        })
    }

    onCharacterLoading = () => { 
        this.setState({
            loading: true,
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }


    render() { 

        const { character, loading, error } = this.state;

        const skeleton = character || loading || error ? null : <Skeleton/>
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error || !character) ? <View character={character} /> : null;

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        );
    }
    
}

const View = ({ character }) => { 
    const { name, description, thumbnail, homepage, wiki, comics } = character;
    return (
        <>
        <div className="char__basics">
                <img src={thumbnail} alt={name} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">

                {comics.length > 0 ? null : 'There are no comics with this character'}
                {comics.map((item, index) => { 
                    return (
                        <li key={index}
                            className="char__comics-item">
                            <a href={homepage}>{item}</a>
                        </li>
                    )
                })}

            </ul>
        </>
    );
}

CharInfo.propTypes = {
    characterId: PropTypes.number
}

export default CharInfo;