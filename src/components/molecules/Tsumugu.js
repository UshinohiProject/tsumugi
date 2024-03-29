import React from 'react';
import { Link } from 'react-router-dom';
import './Tsumugu.css';
import { FaAngleLeft } from "react-icons/fa";

class Tsumugu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            isLoading: true,
            error: null
        };
    }

    componentDidMount() {
        const url = 'https://script.google.com/macros/s/' + process.env.REACT_APP_TSUMUGI_MANAGING_APP_ENDPOINT_ID + '/exec?type=tsumugu&lineId=1';

        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => this.setState({ data: data, isLoading: false }))
            .catch(error => this.setState({ error: error, isLoading: false }));
    }
    render() {
        const { data, isLoading, error } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        }

        if (isLoading) {
            return <div>Loading...</div>;
        }

        const jsonData = JSON.stringify(data, null, 2);
        // JSONデータをパース
        const parsedData = JSON.parse(jsonData);

        // 新しい多次元リストを作成
        const extractedData = parsedData.stories.map(story => [story[0], story[2], story[6], story[3]]);

        return (
            <div>
                <div>
                    <h3 className='center background-red choose-tsumugu'>物語を選んでください。</h3>
                </div>
                <div className='tsumugi-stories'>
                    {extractedData.map((item, index) => (
                        <div className='tsumugi-story'>
                            <span className='tsumugu-story-title'>{item[1]}</span>
                            <span className='tsumugu-story-buttons'>
                                <Link to="/Story" state={{ storyID: item[0] }}>
                                    <button className='button-top-2 button-read-2'>よむ</button>
                                </Link>
                                {item[2] === false ?
                                    <Link to="/Edit" state={{ storyID: item[0], originalStory: item[3] }}>
                                        <button className='button-top-2 button-tsumugu-2'>つむぐ</button>
                                    </Link> :
                                    <Link to="/">
                                        <button className='button-top-2 button-tsumugenai-2' disabled>つむぎ中</button>
                                    </Link>
                                }
                            </span>
                        </div>
                    ))}
                </div>
                <div className='button-back'>
                    <Link to="/">
                        <button>
                            <div className='fa-angle-left'>
                                <FaAngleLeft />
                            </div>
                            戻る
                        </button>
                    </Link>
                </div>
            </div>
        );
    }
}

export default Tsumugu;