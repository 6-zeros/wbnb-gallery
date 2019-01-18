import React from 'react';
import ReactDOM from 'react-dom';
import PhotoDisplay from './PhotoDisplay.jsx';
import PhotoGallery from './PhotoGallery.jsx';
// import newRelic from 'newrelic';

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [
        { photourl: 'http://d13grdp3a2v9nw.cloudfront.net/loading.png' },
        { photourl: 'http://d13grdp3a2v9nw.cloudfront.net/loading.png' },
        { photourl: 'http://d13grdp3a2v9nw.cloudfront.net/loading.png' },
        { photourl: 'http://d13grdp3a2v9nw.cloudfront.net/loading.png' },
        { photourl: 'http://d13grdp3a2v9nw.cloudfront.net/loading.png' },
      ],
      id: null,
      showGallery: false,
      clickIndex: null,
    };
  }

  componentDidMount() {
    const url = window.location.href.split('/');
    this.state.id = url[url.indexOf('rooms')] === undefined ? 0 : url[url.indexOf('rooms') + 1];
    this.fetchPhotos();
  }

  fetchPhotos() {
    const { id } = this.state;
    fetch(`/rooms/${id}/photos`)
      .then(response => response.json())
      .then((body) => {
        console.log(body);
        this.setState({ photos: body });
      });
  }

  toggleGallery(e) {
    e.preventDefault();
    const { id } = e.target;
    const { showGallery } = this.state;
    if (id !== null) {
      const index = Number(id.substring(id.length - 1));
      this.setState({ clickIndex: index });
    }
    this.setState({ showGallery: !showGallery });
  }


  render() {
    const { photos, showGallery } = this.state;

    return (
      <div className="body" >
        <div className="photoDisplay">
          <div id="col-1">
            <PhotoDisplay photo={photos[0].photourl} index={0} showGallery={showGallery} toggleGallery={this.toggleGallery.bind(this)}/>
            <div className="center" id="viewPhotosBtn" onClick={this.toggleGallery.bind(this)}>
              <a>View More</a>
            </div>
          </div>
          <div id="col-2">
            <PhotoDisplay photo={photos[1].photourl} index={1} showGallery={showGallery} toggleGallery={this.toggleGallery.bind(this)}/>
            <PhotoDisplay photo={photos[2].photourl} index={2} showGallery={showGallery} toggleGallery={this.toggleGallery.bind(this)}/>
          </div>
          <div id="col-3">
            <PhotoDisplay photo={photos[3].photourl} index={3} showGallery={showGallery} toggleGallery={this.toggleGallery.bind(this)}/>
            <PhotoDisplay photo={photos[4].photourl} index={4} showGallery={showGallery} toggleGallery={this.toggleGallery.bind(this)}/>
          </div>
        </div>
        <div className="photoGallery">
          {showGallery && (<PhotoGallery photos={photos} toggleGallery={this.toggleGallery.bind(this)} clickIndex={this.state.clickIndex} showGallery={this.state.showGallery}/>)}
        </div>
      </div>
    );
  }

}

export default Gallery;