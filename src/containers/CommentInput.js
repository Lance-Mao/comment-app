import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import CommentInput from '../components/CommentInput'
import {addComment} from '../reducers/comments'

//CommentInputContainer
//负责用户名的加载、保存、评论的发布
class CommentInputContainer extends Component {
    static propTypes = {
        comments: PropTypes.array,
        onSubmit: PropTypes.func
    }

    constructor() {
        super();
        this.state = {
            username: ""
        };
    }

    componentWillMount() {
        //componentWillMount生命周期中初始化用户名
        this._loadUsername();
    }

    _loadUsername() {
        //从localStorage中加载username
        //可以在render方法中传给CommentInput
        const username = localStorage.getItem('username');
        if (username) {
            this.setState({username});
        }
    }

    _saveUsername(username) {
        // 看看 render 方法的 onUserNameInputBlur
        // 这个方法会在用户名输入框 blur 的时候的被调用，保存用户名
        localStorage.setItem('username', username);
    }

    handleSubmitComment(comment) {
        //评论数据的验证
        if (!comment) return;
        if (!comment.username) return alert('请输入用户名');
        if (!comment.content) return alert('请输入评论内容');
        //新增评论保存到LocalStorage中
        const {comments} = this.props;
        const newComments = [...comments, comment];
        localStorage.setItem('comments', JSON.stringify(newComments));
        // this.props.onSubmit 是 connect 传进来的
        // 会 dispatch 一个 action 去新增评论
        if (this.props.onSubmit) {
            this.props.onSubmit(comment);
        }
    }

    render() {
        return (
            <CommentInput
                username={this.state.username}
                onUserNameInputBlur={this._saveUsername.bind(this)}
                onSubmit={this.handleSubmitComment.bind(this)}/>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        comments: state.comments
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSubmit: (comment) => {
            dispatch(addComment(comment))
        }
    }
};

/**
 * 连接 Redux 和 React，它包在我们的容器组件的外一层，
 * 它接收上面 Provider 提供的 store 里面的 state 和 dispatch，传给一个构造函数，返回一个对象，以属性形式传给我们的容器组件。
 */
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommentInputContainer)

/**
 * connect是一个高阶函数，首先传入mapStateToProps、mapDispatchToProps，然后返回一个生产Component的函数(wrapWithConnect)，
 * 然后再将真正的Component作为参数传入wrapWithConnect，这样就生产出一个经过包裹的Connect组件，
 * 该组件具有如下特点:
 * 1、通过props.store获取祖先Component的store
 * 2、props包括stateProps、dispatchProps、parentProps,合并在一起得到nextState，作为props传给真正的Component
 * 3、componentDidMount时，添加事件this.store.subscribe(this.handleChange)，实现页面交互
 * 4、shouldComponentUpdate时判断是否有避免进行渲染，提升页面性能，并得到nextState
 * 5、componentWillUnmount时移除注册的事件this.handleChange
 */