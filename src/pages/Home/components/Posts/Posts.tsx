import { avatarImg } from '@/assets/images'
import { PostProps } from '@/types/post.type'
import Post from '@/components/Post'

const content = `
This is text content
This is link content [link](https://www.google.com)
\`\`\`css
.custom-pre {
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

.custom-pre-code {
  padding: 16px;
  border-radius: 8px;
  overflow: auto;
}
\`\`\`
`

const post: PostProps = {
  title: 'My First Post',
  tags: ['React', 'JavaScript', 'Web Development'],
  userName: 'John Doe',
  userAvatar: avatarImg,
  date: '2023-10-01',
  numberOfLikes: 100,
  numberOfDislikes: 10000,
  numberOfComments: 100000,
  content,
  comments: [
    {
      userName: 'Jane Smith',
      userAvatar: avatarImg,
      date: '2023-10-02',
      numberOfLikes: 10,
      numberOfDislikes: 100,
      content
    },
    {
      userName: 'Jane Smith',
      userAvatar: avatarImg,
      date: '2023-10-02',
      numberOfLikes: 10,
      numberOfDislikes: 100,
      content
    },
    {
      userName: 'Jane Smith',
      userAvatar: avatarImg,
      date: '2023-10-02',
      numberOfLikes: 10,
      numberOfDislikes: 100,
      content
    }
  ]
}

export default function Posts() {
  return (
    <div className='space-y-4'>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
        <Post
          key={item}
          title={post.title}
          tags={post.tags}
          userName={post.userName}
          userAvatar={post.userAvatar}
          date={post.date}
          numberOfLikes={post.numberOfLikes}
          numberOfDislikes={post.numberOfDislikes}
          numberOfComments={post.numberOfComments}
          content={post.content}
          comments={post.comments}
        />
      ))}
    </div>
  )
}
