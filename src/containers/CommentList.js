import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import CommentList from '../components/CommentList';
import {initComments, deleteComment} from "../reducers/comments";
import comments from "../reducers/comments";

//CommentListContainer
//一个Smart组件，负责评论列表数据的加载、初始化、删除评论
//沟通CommentList和state

class CommentListContainer extends Component {
    static propTypes = {
        comments: PropTypes.array,
        initComments: PropTypes.func,
        deleteComment: PropTypes.func
    };

    componentWillMount() {
        // componentWillMount 生命周期中初始化评论
        this._loadComments();
    }

    _loadComments() {
        //从localStorage中加载评论
        let comments = localStorage.getItem('comments');
        comments = comments ? JSON.parse(comments) : [];
        //this.prop.initComments是connect传进来的
        //可以帮我们把数据初始化到state中
        this.props.initComments(comments);
    }

    handleDeleteComment(index) {
        const {comments} = this.props;
        //props是不能变得，所以这里新建了一个删除特定下标的列表
        const newComments = [...comments.slice(0, index),
            ...comments.slice(index + 1)]
        //保存最新的评论列表到LocalStorage
        localStorage.setItem("comments", JSON.stringify(newComments));
        if (this.props.onDeleteComment) {
            //this.props.onDeleteComment是connect传进来的
            //会dispath一个action去删除评论
            this.props.onDeleteComment(index);
        }
    }

    render(){
        return (
            <CommentList
                comments={this.props.comments}
                onDeleteComment={this.handleDeleteComment.bind(this)} />
        );
    }
}

//评论列表从state.comments中获取
const mapStateToProps = (state) => {
    return {comments: state.comments};
}

const mapDispatchToProps = (dispath) => {
    return {
        // 提供给 CommentListContainer
        // 当从 LocalStorage 加载评论列表以后就会通过这个方法
        // 把评论列表初始化到 state 当中
        initComments: (comments) => {
            dispath(initComments(comments));
        },
        //删除评论
        onDeleteComment: (commentIndex) => {
            dispath(deleteComment(commentIndex));
        }
    }
}

// 将 CommentListContainer connect 到 store
// 会把 comments、initComments、onDeleteComment 传给 CommentListContainer
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommentListContainer);