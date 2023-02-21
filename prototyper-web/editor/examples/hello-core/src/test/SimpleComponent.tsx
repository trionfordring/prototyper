import React, { useState } from 'react';

console.log('测试模块载入');

export default function SimpleComponent() {
  const [num, setNum] = useState(1);

  return (
    <div>
      <p>num:{num}</p>
      <button onClick={() => setNum((n) => n + 1)}>点击加一</button>
    </div>
  );
}
