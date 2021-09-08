import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
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
  userIsAuthenticate = false;
  userId: string;
  private postsSub: Subscription = new Subscription();
  private authStatusSub: Subscription
  constructor(public postService: PostsService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage)
    if (this.authService.getUserId())
      this.userId = this.authService.getUserId() as string;
    this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postCount: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount
      });
    this.userIsAuthenticate = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenciated => {
        console.log("is auth", isAuthenciated)
        this.userIsAuthenticate = isAuthenciated;
        if (this.authService.getUserId())
          this.userId = this.authService.getUserId() as string;
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onDelete = (postId: string) => {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage)
    }, () => {
      this.isLoading = false;
    })
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1
    this.postsPerPage = pageData.pageSize
    this.postService.getPosts(this.postsPerPage, this.currentPage)
  }
}



