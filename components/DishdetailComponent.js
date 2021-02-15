import React, { Component }  from 'react';
import { Text, View, ScollView, FlatList, StyleSheet, Modal, Button, Alert, PanResponder, Share } from 'react-native';
import { Card, Icon, Rating, Input } from  'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import  { postComment, postFavorite } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
});

function RenderDish(props){
    const dish = props.dish;
    
    handleViewRef = ref => this.view = ref;
    
    
    const recognizeDrag = ({ moveX, moveY, dx, dy })  => {
        if ( dx < -200 )
            return true;
        else
            return false;
    };
    
    const recognizeComment = ({ moveX, moveY, dx, dy }) => {
        if (dx > 200)
            return true;
        else
            return false;
    };
    
    const panResponder = panResponder.create({
        onStartShouldSetpanResponder: (e, gestureState) => {
           return true; 
        },
        onPanResponderGrant: () => {
            this.view.rubberBand(1000)
                .then(endState => console.log(endState.finished ? 'finished' : 'cancelled' ));
        },
        onPanResponderEnd: (e, gestureState) => {
            if (recognizeDrag(gestureState))
                Alert.alert(
                    'Add to Favorite?',
                    ' Are you sure you wish to add ' + dish.name + ' to your favorite',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel pressed'),
                            style: 'cancel'
                        },
                        {
                            text: 'OK',
                            onPress: () => favorite ? console.log('Already favorite') : markFavorite()
                        }
                    ],
                    {
                        cancelable: false
                    },
                );
                return true;
        } else if (recognizeComment(gestureState)) {
            openCommentForm();
        }
        return true;
    });
    
    const shareDish = (title, message, url) => {
        Share.share({
            title: title,
            message: title + ': ' + message + ' ' + url,
            url: url
        }, { 
            dialogTitle: 'Share ' + title
        });
    }
    
    if (dish != null) {
        return(
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
                ref={this.handleViewRef}
                {...panResponder.panHandlers}>
                <Card 
                    featuredTitle={dish.name}
                    image={{ uri: baseUrl + dish.image}}>
                        <Text style={{margin: 10}}>
                            {dish.description}
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center'}}>
                            <Icon 
                                raised
                                reverse
                                name={props.favorite ? 'heart' : 'heart-o' }
                                type='font-awesome'
                                color='f50'
                                onPress={() => favorite ? console.log('Already favorite') : markFavorite()} 
                            />
                            <Icon 
                                raised
                                reverse
                                name='pencil'
                                type='font-awesome'
                                color='#512DA8'
                                onPress={() => openCommentForm()} />
                            <Icon 
                                raised
                                reverse
                                name={'share'}
                                type='font-awesome'
                                color='#512DA8'
                                style={style.cardItem}
                                onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)} 
                            />
                        </View>
                </Card>
            </Animatable.View>
        );
    }
}

function RenderComments(comments) {
    const comments = props.comments;
    
    const renderCommentItem = ({ item, index}) => {
        return(
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{{item.comment}}</Text>
                <Text style={{fontSize: 12}}>{item.rating} Starts</Text>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date}</Text>
            </View>
        );
    }
    
    return(
      <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title="Comments">
                <FlatList 
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()} />
            </Card>
        </Animatable.View>
    );
}

class  Dishdetail extends Component {
    
constructor(props) {
    super(props);
    this.state = this.defaultState();
}
    static navigationOption = {
        title: 'Dish Details'
    };
    
    defaultState() {
        return({
            rating: 3,
            author: '',
            comment: '',
            showCommentForm: false
        })
    }
    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }
    
    resetCommentForm(){
        this.setState(this.defaultState());
    }
    
    handleComment(dishId){
        this.props.postCOmment(dishId, this.state.rating, this.state.author, this.state.comment);
        this.resetCommentForm();
    }
    
    setRating(rating) {
        this.setState({
            rating
        })
    }
    
    setAuthor(author) {
        this.setState({comment})
    }
    
    render() {
         const dishId = this.props.navigation.getParam('dishId', '');
        
         return(
             <ScrollView>
                <RenderDish dish={this.props.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    markFavorite={() => this.markFavorite(dishId)}
                    openCommentForm={() => this.openCommentForm()}
                />
                
                <Modal 
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showCommentForm}
                    onDismiss={() => {thhis.resetCommentForm()}}
                    onRequestClose={() => {this.resetCommentForm()}}>
                
                    <View styles.modal>
                        <Text style={styles.modalTitle}> Add Your Comment </Text>
                        <Rating 
                            minValue={1}
                            startingValue={3}
                            fraction={0}
                            showRating={true}
                            onFinishRating={(rating) => this.setRating(rating)} />
                            <Input 
                                placeholder="Author"
                                leftIcon={
                                <Icon
                                    name='user'
                                    type='font-awesome' /> }
                                onChangeText={(author) => this.setAuthor(author)} />
                            <Input 
                                placeholder="Comment"
                                leftIcon={
                                <Icon
                                    name='comment'
                                    type='font-awesome' /> }
                                onChangeText={(comment) => this.setComment(comment)} />
                            <Button onPress={() => {this.handleComment(dishId)}}
                                    color='#512DA8'
                                    title='SUBMIT' />
                            <Button onPress={() => {this.resetComment()}}
                                    color='#6c757d'
                                    title='CANCEL' />
                    </View>
                </Modal>
                
                <RenderComments comments={this.props.comments.filter((comment) => comment.dishId === dishId)} />
            </ScrollView>
        );
    }
   
}

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);
