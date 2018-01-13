import React, { Component } from 'react';
import ClassificationForm from './classification-options';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import { SegmentImage } from './segment-image';
import { rectangleIcon, polygonIcon } from './icons';
import screenText from './screen-text';

export class LabelingScreen extends Component {
  state = {
    customization: screenText
  };

  customizationSubscription;

  componentWillMount(){
    this.customizationSubscription = window.Labelbox.getTemplateCustomization()
      .subscribe((customization) => {
        this.setState({...this.state, customization});
      });
  }

  componentWillUnmount(){
    this.customizationSubscription.unsubscribe();
  }

  render() {
    if (!this.props.imageUrl) {
      return (<div>Loading...</div>);
    }

    const onSubmit = (label) => {
      this.props.onSubmit(JSON.stringify(this.state.segmentation));
      this.setState({...this.state, segmentation: undefined});
    };

    return (
      <Card>
        <CardContent>
          <div>
            <SegmentImage
              imageUrl={this.props.imageUrl}
              style={{width: '100%'}}
              updateLabel={(segmentation) => this.setState({...this.state, segmentation})}
            />
          </div>
          <div className="form-controls">
            <div>{this.state.customization.instructions}</div>
          </div>
        </CardContent>
        <CardActions style={{justifyContent: 'flex-end'}}>
          <Button
            raised={true}
            color="primary"
            disabled={!this.state || !this.state.segmentation || this.state.segmentation.length === 0}
            onClick={onSubmit}
          >Submit</Button>
        </CardActions>
      </Card>
    );
  }
}
