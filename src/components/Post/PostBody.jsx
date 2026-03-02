import React from 'react'

export default function PostBody({body , image }) {
  
  return (
    <div>
           {body && <p>{body}</p>}
          {image && (
            <div className="w-full my-3">
              <img
                className="w-full max-h-96 object-contain rounded-md"
                src={image}
                alt={body}
              />
            </div>
          )}
    </div>
  )
}


