const BodySection = ({ post }) => {
  return (
    <div className='flex flex-col gap-3 overflow-hidden'>
        <span className='text-xl whitespace-pre-wrap'>{post.text}</span>
        {post.img && (
            <img 
                src={post.img} 
                alt='' 
                className='h-auto object-contain w-auto max-w-full rounded-lg border border-gray-700' 
            />
        )}
    </div>
  )
}

export default BodySection