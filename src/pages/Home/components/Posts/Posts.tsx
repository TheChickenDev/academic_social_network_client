import { avatarImg } from '@/assets/images'
import { PostProps } from '@/types/post.type'
import Post from '@/components/Post'

const codeBlock = `.custom-pre {
  padding: 16px;
  border-radius: 8px;
  overflow: auto;
}

.custom-line {
  display: flex;
}

.line-number {
  width: 30px;
  text-align: right;
  margin-right: 10px;
  color: #999;
}

.custom-token {
  font-family: 'Fira Code', monospaceajdfjkalsfdhjlkdsahflkahsflhaslkjfhlahflahsfjklhasjkfdhlajkshdfjlkaghfkjagsfjka;
}
`

const contents = [
  { content: 'This is a text content', type: 'text', language: null },
  { content: codeBlock, type: 'code', language: 'css' },
  {
    content: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3LG1YECRFzQtc7u_ipIfyo-CC5WE2VOThfw&s',
    type: 'image',
    language: null
  }
]

const commentContents = [
  { content: 'This is a text content', type: 'text', language: null },
  { content: codeBlock, type: 'code', language: 'css' },
  {
    content: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3LG1YECRFzQtc7u_ipIfyo-CC5WE2VOThfw&s',
    type: 'image',
    language: null
  }
]

const post: PostProps = {
  title: 'My First Post',
  tags: ['React', 'JavaScript', 'Web Development'],
  userName: 'John Doe',
  userAvatar: avatarImg,
  date: '2023-10-01',
  numberOfLikes: 100,
  numberOfDislikes: 10000,
  numberOfComments: 100000,
  contents,
  comments: [
    {
      userName: 'Jane Smith',
      userAvatar: avatarImg,
      date: '2023-10-02',
      numberOfLikes: 10,
      numberOfDislikes: 100,
      contents: commentContents
    },
    {
      userName: 'Jane Smith',
      userAvatar: avatarImg,
      date: '2023-10-02',
      numberOfLikes: 10,
      numberOfDislikes: 100,
      contents: commentContents
    },
    {
      userName: 'Jane Smith',
      userAvatar: avatarImg,
      date: '2023-10-02',
      numberOfLikes: 10,
      numberOfDislikes: 100,
      contents: commentContents
    }
  ]
}

export default function Posts() {
  return (
    <div className='space-y-4'>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => (
        <Post
          title={post.title}
          tags={post.tags}
          userName={post.userName}
          userAvatar={post.userAvatar}
          date={post.date}
          numberOfLikes={post.numberOfLikes}
          numberOfDislikes={post.numberOfDislikes}
          numberOfComments={post.numberOfComments}
          contents={post.contents}
          comments={post.comments}
        />
      ))}
    </div>
  )
}
