import React from 'react';
import PhotoCarousel from './PhotoCarousel.jsx';

class PhotoGallery extends React.Component {
  constructor(props) {
    super(props);
    let { clickIndex, photos, toggleGallery, length, showList, lightMode } = this.props;
    this.state = {
      clickIndex: clickIndex,
      photos: photos,
      toggleGallery: toggleGallery,
      length: photos.length - 1,
      showList: true,
      lightMode: false,
    };
  }

  projectUpTop(e) {
    e.preventDefault();
    this.setState({ clickIndex: Number(e.target.id) });
  }

  showOrHideList(e) {
    e.preventDefault();
    const { showList } = this.state;
    this.setState({ showList: !showList });
  }

  changeBackgroundColor(e) {
    e.preventDefault();
    const { lightMode } = this.state;
    this.setState({ lightMode: !lightMode });
  }

  previous() {
    const { clickIndex, length } = this.state;
    if (clickIndex !== 0) {
      const newIndex = clickIndex - 1;
      this.setState({ clickIndex: newIndex });
    } else {
      this.setState({ clickIndex: length });
    }
  }

  forward() {
    const { clickIndex, length } = this.state;
    if (clickIndex !== length) {
      const newIndex = clickIndex + 1;
      this.setState({ clickIndex: newIndex });
    } else {
      this.setState({ clickIndex: 0 });
    }
  }

  render() {
    const {
      clickIndex, photos, toggleGallery, length, showList, lightMode,
    } = this.state;

    return (
      <div className="modal" id={lightMode ? 'lightMode' : 'modal'}>
        <div className="modal-content" id={lightMode ? 'lightModeX' : 'modal-content'}>
          <span className="closeBtn" onClick={toggleGallery}>&times;</span>
          <div className="mainDisplay">
            <h1 className="btn" id="back" onClick={this.previous.bind(this)} value="back">{'<'}</h1>
            <img id="leadImage" src={photos[clickIndex].photourl} onClick={this.forward.bind(this)} />
            <h1 className="btn" id="forward" onClick={this.forward.bind(this)} value="forward">{'>'}</h1>
          </div>
          <div className="description">
            <p className="caption">{`${clickIndex + 1}/${length + 1}: ${photos[clickIndex].photocaption}`}</p>
            <p className="showList" onClick={this.showOrHideList.bind(this)}>{showList ? 'hide photo list' : 'show photo list'}</p>
          </div>
          <div className="photo-carousel" id={showList ? 'showCarousel' : null}>
            {photos.map((photo, index) => <PhotoCarousel photo={photo} key={index} index={index} projectUpTop={this.projectUpTop.bind(this)} clickIndex={this.state.clickIndex} />)}
          </div>
          <div className="lighting">
            {lightMode
              ? <img id="lightbulb" src="https://s3-us-west-1.amazonaws.com/fec-errbnb/lightbulb_on.png" onClick={this.changeBackgroundColor.bind(this)} />
              : <img id="lightbulb" src="https://s3-us-west-1.amazonaws.com/fec-errbnb/lightbulb.png" onClick={this.changeBackgroundColor.bind(this)} />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default PhotoGallery;
