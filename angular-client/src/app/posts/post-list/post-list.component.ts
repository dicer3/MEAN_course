import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { Post } from "../post.model"
import { PostsService } from "../post.service";
@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2
  currentPage = 1
  pageSizeOptions = [1, 2, 3, 4, 5]
  private postsSub: Subscription = new Subscription();
  constructor(public postService: PostsService) {

  }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage)
    this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postCount: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  onDelete = (postId: string) => {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage)
    })
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1
    this.postsPerPage = pageData.pageSize
    this.postService.getPosts(this.postsPerPage, this.currentPage)
  }
}



