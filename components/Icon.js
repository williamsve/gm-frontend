import React from 'react'
import {
  MdBuild,
  MdChevronLeft,
  MdChevronRight,
  MdCheckCircle,
  MdShield,
  MdGroups,
  MdAccessTime,
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdMenu,
  MdKeyboardArrowUp,
  MdClose,
  MdVisibility,
  MdAdd,
  MdFormatQuote,
  MdStar,
  MdWork,
  MdFolder,
  MdEdit,
  MdDelete,
  MdSave,
  MdHome
} from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'

const ICONS = {
  build: MdBuild,
  chevronLeft: MdChevronLeft,
  chevronRight: MdChevronRight,
  check: MdCheckCircle,
  shield: MdShield,
  groups: MdGroups,
  clock: MdAccessTime,
  phone: MdPhone,
  email: MdEmail,
  location: MdLocationOn,
  whatsapp: FaWhatsapp,
  menu: MdMenu,
  keyboardArrowUp: MdKeyboardArrowUp,
  close: MdClose,
  visibility: MdVisibility,
  add: MdAdd,
  formatQuote: MdFormatQuote,
  star: MdStar,
  work: MdWork,
  folder: MdFolder,
  edit: MdEdit,
  delete: MdDelete,
  save: MdSave,
  home: MdHome
}

export default function Icon({ name, className = '', size, ...props }) {
  const Comp = ICONS[name]
  if (!Comp) return null
  // Allow tailwind text-size classes (text-xl etc.) and size prop as fallback
  const passed = { className, ...props }
  if (size) passed.size = size
  return <Comp {...passed} />
}

export { ICONS }
