acciones de WPPConnect

1. Gestión de Chats (Orden y Prioridad)
   client.markUnseenMessage(chatId): Lo que ya usamos, marca como no leído.
   client.sendSeen(chatId): Marca todo el chat como leído.
   client.archiveChat(chatId, true/false): Archiva o desarchiva un chat (ideal para "limpiar" la vista del asesor).
   client.pinChat(chatId, true/false): Ancla o desancla un chat arriba de todo.
   client.deleteChat(chatId): Borra el chat por completo.
2. Etiquetas (Solo WhatsApp Business)
   client.getAllLabels(): Te devuelve la lista de todas tus etiquetas y sus IDs (muy útil para saber cuál es el ID '13', '14', etc.).
   client.addOrRemoveLabels([chatId], [{ labelId: 'ID', type: 'add' }]): Lo que configuramos recién.
   client.addNewLabel('Nombre de Etiqueta'): Crea una etiqueta nueva desde el código.
3. Mensajería Avanzada
   client.sendText(chatId, 'texto'): El clásico.
   client.sendImage(chatId, 'ruta/a/img.jpg', 'nombre', 'caption'): Envía imágenes.
   client.sendAudio(chatId, 'ruta/al/audio.mp3'): Envía audios (se ven como grabados en el momento).
   client.sendFile(chatId, 'ruta/file.pdf'): Envía documentos.
   client.sendContact(chatId, 'numero@c.us', 'Nombre'): Envía una ficha de contacto.
4. Acciones de Grupo
   client.createGroup('Nombre', ['user1@c.us', 'user2@c.us']): Crea un grupo.
   client.addParticipant(groupId, 'user@c.us'): Agrega a alguien.
   client.removeParticipant(groupId, 'user@c.us'): Expulsa a alguien.
   client.promoteParticipant(groupId, 'user@c.us'): Hace admin a alguien.
5. Estado y Presencia
   client.setChatState(chatId, 0 | 1 | 2): Simula que el bot está escribiendo (0), grabando audio (1) o nada (2). Muy bueno para que el bot parezca más "humano".
   client.setProfileName('Nuevo Nombre'): Cambia el nombre del bot.
   client.setProfileStatus('Ocupado'): Cambia la info (biografía).
