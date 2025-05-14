import { NextFunction, Request, Response } from 'express';
import { Post } from '../model/post.model';
import { AppError } from '../../../middleware/app.error';
import { catchError } from '../../../middleware/catch.error';
import { UserType } from '../../../../types/UserType';
import { v2 as cloudinary } from 'cloudinary';

declare global {
  namespace Express {
    interface Request {
      user?: UserType;
    }
  }
}
export const createPosts = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { comment } = req.body;
    const { id } = req.user!;
    const url = req.file?.path;

    if (!url) {
      throw new AppError('No file uploaded', 400);
    }

    //upload imag Cloudinary
    const uploadResult = await cloudinary.uploader
      .upload(url)
      .catch((error) => {
        console.error('Cloudinary upload error:', error);
        throw new AppError('Failed to upload image', 500);
      });


    const post = await Post.create({
      url: uploadResult.secure_url, //use it secure_url
      comment,
      user: id,
    });

    if (!post) throw new AppError('Failed to create post', 500);

    res.status(201).json({
      status: 'success',
      data: post,
    });
  }
);
export const deletePosts = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;
    if (!postId) {
      throw new AppError('Invalid post ID', 400);
    }
    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User not authenticated', 401);
    }

    // Find the post and verify ownership
    const post = await Post.findById(postId);
    if (!post) {
      throw new AppError('Post not found', 404);
    }

    // Check if the authenticated user is the owner of the post
    if (post.user.toString() !== req.user.id) {
      throw new AppError(
        'Unauthorized: You can only delete your own posts',
        403
      );
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    // Return success response
    res.status(200).json({
      status: 'success',
      message: 'Post deleted successfully',
    });
  }
);

export const updatePosts = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User not authenticated', 401);
    }

    // Find the post and verify ownership
    const post = await Post.findById(postId);
    if (!post) {
      throw new AppError('Post not found', 404);
    }

    // Check if the authenticated user is the owner of the post
    if (post.user.toString() !== req.user.id) {
      throw new AppError(
        'Unauthorized: You can only delete your own posts',
        403
      );
    }

    const { url, comment } = req.body;
    if (!postId) throw new AppError('Id not valid', 404);
    const postUpdate = await Post.findByIdAndUpdate(
      postId,
      { url, comment },
      { new: true }
    );
    if (!postUpdate) throw new AppError('Post not found', 404);
    res.status(200).json({
      status: 'success',
      data: postUpdate,
    });
  }
);
export const getPostById = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;
    if (!req.user || !req.user.id) {
      throw new AppError('Unauthorized: User not authenticated', 401);
    }
    // Find the post and verify ownership
    const postFound = await Post.findById(postId);
    if (!postFound) {
      throw new AppError('Post not found', 404);
    }

    // Check if the authenticated user is the owner of the post
    if (postFound.user.toString() !== req.user.id) {
      throw new AppError(
        'Unauthorized: You can only delete your own posts',
        403
      );
    }

    if (!postFound) throw new AppError('id not valid', 404);
    const post = await Post.findById(postId);
    res.status(200).json({
      status: 'success',
      data: post,
    });
  }
);
