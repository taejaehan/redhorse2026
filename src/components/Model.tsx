import { useGLTF } from '@react-three/drei'
import { GroupProps } from '@react-three/fiber'

interface ModelProps extends GroupProps {
  url: string
}

function Model({ url, ...props }: ModelProps) {
  const { scene } = useGLTF(url)

  return <primitive object={scene} {...props} />
}

export default Model
