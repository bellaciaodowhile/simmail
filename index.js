console.log('Sim Mail JS')

const dataMails = [
    {
        id: 0,
        title: 'Allegro',
        user: 'allegro@mail.com',
        date: 'May 06, 2023',
        time: '21:37',
        message: `La anuncio que te gustó terminó el 2023-11-27, pero el vendedor a anunciado algunos artículos similares. ¡Ve a su cuenta y échale un vistazo! <a href="#">Producto</a>`,
        file: '',
        status: 'input',
        responses: []
    },
    {
        id: 1,
        title: 'Oferta de trabajo',
        user: 'ana@gmail.com',
        date: 'May 06, 2023',
        time: '21:36',
        message: `Hola Alex, me encontré con una foerta de trabajo fantástica que inmediatamente me hizo pensar en ti. Creo que serías un excelente candidato para el puesto y deberías postularte. Aquí está el enlace: Oferta de Trabajo 52. Solo envía tu currículum a hr@somecomány.com. ¡Si obtienes una entrevista, me encataría saber cómo te fue! ¡Cruzando los dedos, Ana!`,
        file: '',
        status: 'input',
        responses: []
    },
    {
        id: 2,
        title: 'Por favor envíanos los detalles de tu tarjeta de credito',
        user: 'sender@mail.com',
        date: 'May 06, 2023',
        time: '21:35',
        message: `Lorem Ipsum...`,
        file: '',
        status: 'input',
        responses: []
    },
    {
        id: 3,
        title: 'Pendiente',
        user: 'sender@mail.com',
        date: 'May 06, 2023',
        time: '21:35',
        message: `Lorem Ipsum...`,
        file: '',
        status: 'draft',
        responses: []
    },
];

const RESPONSES = [];

const MONTHS = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
];

const smailToast = document.querySelector('.smail-toast');

const mailsBox = document.querySelector('.smail-boxs');

const options = document.querySelectorAll('.smail-options .smail-option');
const optionBack = document.querySelector('.smail-option--back');
const mailMessage = document.querySelector('.smail-mail-content');
const allAttachsItem = document.querySelectorAll('.smail-attachs-item');


// Delete
const iconDelete = document.querySelector('.smail-option--delete');

// Archived
const iconArchived = document.querySelector('.smail-option--archived');

// Trash
const iconTrash = document.querySelector('.smail-option--trash');

// No read
const iconNoRead = document.querySelector('.smail-option--no-read');

// Marked Mail
const iconMarkedMail = document.querySelector('.smail-option--marked');

// Main Modal
const smailModal = document.querySelector('.smail-main-modal');
const smailModalClose = document.querySelector('.smail-close-modal')

// Open attachs 
const openAttachs = document.querySelector('.smail-open');

// Upload attachs
const uploadAttach = document.querySelector('.upload-attach')

// Send mail
const sendMail = document.querySelector('.smail-send');

// New message
const contentWindow = document.querySelector('.smail-main-new');
const closeWindow = document.querySelector('.close-window');
const iconNewmessage = document.querySelector('.smail-option--new');

// Clean trash
const iconCleanTrash = document.querySelector('.smail-option.smail-option--draft')

const menuTabs = document.querySelectorAll('.smail-sidebar__menu li');
const menuSmails = document.querySelectorAll('.smail-mails');

// Data general
function viewData(data, section, isBack = true) {
    const mailBoxInput = document.querySelector(`.smail-mails[data-tab="smail-${ section }"]`)
    
    if (mailBoxInput.children[0]) {
        if (!mailBoxInput.children[0].classList.contains('smail-mail')) {
            mailBoxInput.innerHTML = '';
        }
    }

    back(`smail-${ section }`, isBack);

    let notRead = '';
    if (section == 'trash') section = 'delete';
    const isData = data.filter(function(x) { return x.status == section })
    console.log(section)
    console.log(isData)

    if (section == 'send' || section == 'input') notRead = 'smail-mail--no-read'
    if (isData.length > 0) {
        isData.forEach(function(mail) {
            mailBoxInput.innerHTML += `
            <div class="smail-mail ${ notRead }" data-mail="${ mail.id }">
                <div class="smail-flex">
                    <div class="smail-mail--user">${ mail.user }</div>
                    <div class="smail-mail--icon">
                        <img src="./icons/icono_nomarcado.png" width="17px">
                    </div>
                </div>
                <div class="smail-flex smail-mail--datetime">
                    <small class="smail-mail--date">${ mail.date }</small>
                    <small class="smail-mail--time">${ mail.time }</small>
                </div>
                <small class="smail-mail--footer">${ mail.title }</small>
            </div>`;
    
            document.querySelectorAll('.smail-mail').forEach(function(mail) {
                const mailMarked = mail.querySelector('.smail-mail--icon');
                const mailIndex = mail.attributes['data-mail'].textContent;
            
                mailMarked.onclick = function(e) {
                    e.stopPropagation();
                    saveMarked(mailIndex);
                }
                
                mail.onclick = function(e) {
                    e.preventDefault();
                    openMail(mailIndex)
                }
                console.log(mail)
            });
    
    
        });
    } else {
        mailBoxInput.innerHTML = '<strong><center>No existen correos en esta sección</center></strong>';
    }
    countAllMails(section);
    
}
viewData(dataMails, 'input');
const drafts = dataMails.filter(function(x) { return x.status == 'draft' })
viewData(drafts, 'draft', false)

// Attachs
allAttachsItem.forEach(function(item) {
    item.onclick = function(e) {
        e.preventDefault();
        allAttachsItem.forEach(function(x) { x.classList.remove('smail-attachs-item--active') });
        item.classList.add('smail-attachs-item--active');
    }
});

// Menu tabs
menuTabs.forEach(function(li) {

    if (li.hasAttribute('data-tab')) {

        li.onclick = function(e) {
            e.preventDefault();

            // All list mails
            mailsBox.classList.remove('smail-none')

            const dataTab = li.attributes['data-tab'].textContent;
            menuTabs.forEach(function(x) {  x.classList.remove('smail-sidebar__menu--active') })
            console.log(dataTab)
            if (dataTab == 'smail-mail-trash') {
                if (dataMails.filter(function(x) { return x.status == 'mail-trash' }).length > 0) {
                    const optionDraft = document.querySelector('.smail-option--draft');
                    optionDraft.classList.add('smail-option--active');
                }
            }

            mailMessage.classList.remove('smail-mail-content--active');
            options.forEach(function(option) {
                if (option.classList.contains('smail-option--active')) {
                    if (dataTab != 'smail-mail-trash') {
                        option.classList.remove('smail-option--active');
                    }
                }
            });
            menuSmails.forEach(function(smail) {
                if (smail.attributes['data-tab'].textContent == dataTab) {
                    smail.classList.add('smail-mails--active');
                    li.classList.add('smail-sidebar__menu--active');
                } else {
                    smail.classList.remove('smail-mails--active');
                }
            });

        }
    }
});

const btnResponse = document.querySelector('.smail-response');

// Open Mail
function openMail(mailIndex) {   
    console.log(`Estas abriendo el correo: ${ mailIndex }`)
    options.forEach(function(option) {
        if (!option.classList.contains('smail-option--active')) {
            if (!option.classList.contains('smail-option--draft')) {
                option.classList.add('smail-option--active');
            }
        }
    });
    mailsBox.classList.add('smail-none');
    mailMessage.classList.add('smail-mail-content--active');
    document.querySelector(`.smail-mail[data-mail="${ mailIndex }"]`).classList.remove('smail-mail--no-read');

    mailMessage.setAttribute('id', mailIndex)
    const title = document.querySelector('.mail-title');
    const user = document.querySelector('.mail-user');
    const date = document.querySelector('.mail-date');
    const time = document.querySelector('.mail-time');
    const message = document.querySelector('.mail-message');
    const file = document.querySelector('.mail-file');
    btnResponse.setAttribute('data-id', mailIndex)
    document.querySelector('.smail-send-response').setAttribute('data-id', mailIndex)

    const mailDropdown = document.querySelectorAll('.dropdown');
    
    mailDropdown.forEach(function(item) {
        const mailDelete = item.querySelector('.dropdown-content');
        mailDelete.setAttribute('data-delete', mailIndex);
    });

    title.textContent = dataMails[mailIndex].title
    user.textContent = dataMails[mailIndex].user
    date.textContent = dataMails[mailIndex].date
    time.textContent = dataMails[mailIndex].time
    message.innerHTML = dataMails[mailIndex].message.replace(/\n/g, '<br>');
    file.innerHTML = dataMails[mailIndex].file

    viewResponses(mailIndex)

    countAllMails();
}

// Count Mails
function countAllMails(section) {
    const mailBoxInput = document.querySelector(`.smail-mails[data-tab="smail-${ section }"]`)
    const countMails = document.querySelector('.smail-sidebar__menu [data-tab="smail-input"]').children[1];
    const countMailsSend = document.querySelector('.smail-sidebar__menu [data-tab="smail-send"]').children[1];
    const countMailsArvhived = document.querySelector('.smail-sidebar__menu [data-tab="smail-archived"]').children[1];
    const countMailsDelete = document.querySelector('.smail-sidebar__menu [data-tab="smail-trash"]').children[1];
    const countMailsTrash = document.querySelector('.smail-sidebar__menu [data-tab="smail-mail-trash"]').children[1];

    const mailsNoRead = document.querySelectorAll('[data-tab="smail-input"] .smail-mail--no-read');
    countMails.textContent = mailsNoRead.length;
   
    
    if (dataMails.filter(function(x) { return x.status == 'delete' }).length > 0) {
        countMailsDelete.textContent = dataMails.filter(function(x) { return x.status == 'delete' }).length
    } else {
        countMailsDelete.textContent = '';
        document.querySelector(`.smail-mails[data-tab="smail-trash"]`)
            .innerHTML = '<strong><center>No existen correos en esta sección</center></strong>';
    }
    if (dataMails.filter(function(x) { return x.status == 'mail-trash' }).length > 0) {
        countMailsTrash.textContent = dataMails.filter(function(x) { return x.status == 'mail-trash' }).length
    } else {
        countMailsTrash.textContent = '';
        document.querySelector(`.smail-mails[data-tab="smail-mail-trash"]`)
            .innerHTML = '<strong><center>No existen correos en esta sección</center></strong>'
    }
    if (dataMails.filter(function(x) { return x.status == 'archived' }).length > 0) {
        countMailsArvhived.textContent = dataMails.filter(function(x) { return x.status == 'archived' }).length
    } else {
        countMailsArvhived.textContent = '';
        document.querySelector(`.smail-mails[data-tab="smail-archived"]`)
            .innerHTML = '<strong><center>No existen correos en esta sección</center></strong>'
    }
    if (dataMails.filter(function(x) { return x.status == 'send' }).length > 0) {
        countMailsSend.textContent = dataMails.filter(function(x) { return x.status == 'send' }).length
    } else {
        countMailsSend.textContent = '';
        document.querySelector(`.smail-mails[data-tab="smail-send"]`)
            .innerHTML = '<strong><center>No existen correos en esta sección</center></strong>'
    }

    console.log(dataMails)



}

// Save marked
function saveMarked(mailIndex) {
    console.log(`Estas marcando: ${ mailIndex }`)
    const mailCurrent = document.querySelector(`[data-mail="${ mailIndex }"]`);
    const lastImg = mailCurrent.querySelector('.smail-mail--icon img').src.split('/')

    if (lastImg[lastImg.length - 1] == 'icono_nomarcado.png') {
        mailCurrent.querySelector('.smail-mail--icon img').src = './icons/icono_marcar.svg';
    } else {
        mailCurrent.querySelector('.smail-mail--icon img').src = './icons/icono_nomarcado.png';
    }
    back();
}

// Delete mail
function deleteMail(mailIndex) {
    console.log(`Estas eliminando el correo: ${ mailIndex }`)
    const mailCurrent = document.querySelector(`[data-mail="${ mailIndex }"]`);
    mailCurrent.remove();

    const data = dataMails.filter(function(x) { return x.id == mailIndex })

    if (data[0].status == 'draft'){
        const counterDraft = document.querySelector('.smail-sidebar [data-tab="smail-draft"]').children[1];
        counterDraft.textContent = '';
    }

    data[0].status = 'delete';

    const newData = data.filter(function(x) { return x.status == 'delete' })
    viewData(newData, 'trash')
    console.log(newData)
}

// Archived mail
function archivedMail(mailIndex) {
    console.log(`Estas archivando el correo: ${ mailIndex }`)
    const mailCurrent = document.querySelector(`[data-mail="${ mailIndex }"]`);
    mailCurrent.remove();

    const data = dataMails.filter(function(x) { return x.id == mailIndex })
    data[0].status = 'archived';

    const newData = data.filter(function(x) { return x.status == 'archived' })
    viewData(newData, 'archived')
    console.log(newData)
} 

// Trash mail
function trashMail(mailIndex) {
    console.log(`Estas moviendo el correo: ${ mailIndex } a la basura`)
    const mailCurrent = document.querySelector(`[data-mail="${ mailIndex }"]`);
    mailCurrent.remove();

    const data = dataMails.filter(function(x) { return x.id == mailIndex })
    data[0].status = 'mail-trash';

    const newData = data.filter(function(x) { return x.status == 'mail-trash' })
    viewData(newData, 'mail-trash')
    console.log(newData)
} 

// Trash mail
function noReadMail(mailIndex) {
    console.log(`Estas marcando como no leído al correo: ${ mailIndex }`)
    const mailCurrent = document.querySelector(`[data-mail="${ mailIndex }"]`);
    mailCurrent.classList.add('smail-mail--no-read')
    countAllMails();
} 

openAttachs.onclick = function(e) {
    e.preventDefault();

    const upload = document.querySelector('.smail-archive');
    const archive = document.querySelector('.smail-attachs-item--active').textContent;

    upload.innerHTML = '';
    upload.innerHTML += `
    <div>
        <span>${ archive }</span>
        <span onclick="this.parentElement.remove();">x</span>
    </div>`;

    smailModal.classList.remove('smail-main-modal--active');

    console.log('Abriendo')
}

// Upload attach
uploadAttach.onclick = function(e) {
    e.preventDefault();
    smailModal.classList.add('smail-main-modal--active');
}
smailModalClose.onclick = function(e) {
    e.preventDefault();
    smailModal.classList.remove('smail-main-modal--active');
}

// Option Back
optionBack.onclick = function(e) {
    e.preventDefault();
    back();
}

// Close window - New message
closeWindow.onclick = function(e) {
    e.preventDefault();
    contentWindow.classList.remove('smail-main-new--active');
}

// Open Window - New message
iconNewmessage.onclick = function(e) {
    e.preventDefault();
    contentWindow.classList.add('smail-main-new--active');
}

// Delete - Trigger

iconDelete.onclick = function(e) {
    e.stopPropagation();
    deleteMail(mailMessage.getAttribute('id'));
}

// Archived - Trigger
iconArchived.onclick = function(e) {
    e.stopPropagation();
    archivedMail(mailMessage.getAttribute('id'));
}

// Trash - Trigger
iconTrash.onclick = function(e) {
    e.stopPropagation();
    trashMail(mailMessage.getAttribute('id'));
}

// No read - Trigger
iconNoRead.onclick = function(e) {
    e.stopPropagation();
    noReadMail(mailMessage.getAttribute('id'));
    back();
}

// Marked
iconMarkedMail.onclick = function(e) {
    e.stopPropagation();
    saveMarked(mailMessage.getAttribute('id'));
}

// Send mail
sendMail.onclick = function(e) {
    e.preventDefault();

    let to = document.querySelector('input[name="to"]').value;
    let cc = document.querySelector('input[name="cc"]').value;
    let cco = document.querySelector('input[name="cco"]').value;
    let title = document.querySelector('input[name="title"]').value;
    let message = document.querySelector('textarea[name="message"]').value;
    let date = new Date();
    let today = `${ MONTHS[date.getMonth()] } ${ date.getDate() }, ${ date.getFullYear() }`;
    let currentTime = `${ date.getHours() }:${ date.getMinutes() }`
    let upload = document.querySelector('.smail-archive div span');
    let file = '';

    if (to == '' || title == '' || message == '') {
        smailToast.textContent = 'Los campos: Para, Asunto y Mensaje son obligatorios';
        smailToast.classList.add('smail-toast--active');
        setTimeout(() => {
            smailToast.classList.remove('smail-toast--active');
        }, 4000);
        return;
    }

    if (upload) file = `
        <a href="#">
            <img src="./icons/clip.png" width="20px" class="smail-clip">
            <span>${upload.textContent.trim()}&nbsp;Descargar</span>
        </a>`

    const newMail = {
        id: dataMails.length,
        title,
        user: to,
        date: today,
        time: currentTime,
        message,
        file,
        status: 'send',
        responses: []
    }

    document.querySelector('input[name="to"]').value = '';
    document.querySelector('input[name="cc"]').value = '';
    document.querySelector('input[name="cco"]').value = '';
    document.querySelector('input[name="title"]').value = '';
    document.querySelector('textarea[name="message"]').value = '';

    console.log(newMail)

    contentWindow.classList.remove('smail-main-new--active');
    console.log('Enviando correo')

    smailToast.textContent = 'El mensaje se ha enviado.';
    smailToast.classList.add('smail-toast--active');
    setTimeout(() => {
        smailToast.classList.remove('smail-toast--active');
    }, 4000);

    dataMails.push(newMail);

    const newData = dataMails.filter(function(x) { return x.status == 'send' })
    viewData(newData, 'send')

    console.log(newData)

}

// Clean trash
iconCleanTrash.onclick = function(e) {
    e.preventDefault();
    const countMailsTrash = document.querySelector('.smail-sidebar__menu [data-tab="smail-mail-trash"]').children[1];

    dataMails.filter(function(x) { return x.status == 'mail-trash' })
    dataMails.forEach(function(item){
        item.status = 'none';
    });

    viewData(dataMails, 'mail-trash', false);
    countMailsTrash.innerHTML = '';

    smailToast.textContent = 'Has eliminado todo el correo basura';
    smailToast.classList.add('smail-toast--active');
    setTimeout(() => {
        smailToast.classList.remove('smail-toast--active');
    }, 4000);
}

function dropdowns() {
    const mailDropdown = document.querySelectorAll('.dropdown');
    
    mailDropdown.forEach(function(item) {
        const mailDelete = item.querySelector('.dropdown-content');
        item.onclick = function(e) {
            e.preventDefault();
            mailDelete.classList.toggle('dropdown-content--active');
        }
        mailDelete.onclick = function(e) {
            e.stopPropagation();
            deleteMail(mailMessage.getAttribute('id'));
        }
    })
    
}
dropdowns();

// Option Back
function back(dataTab, isBack = true) {
    console.log('Atras')

    if (isBack) {
        // All list mails
        mailsBox.classList.remove('smail-none');
        // Only mail
        mailMessage.classList.remove('smail-mail-content--active');

        options.forEach(function(option) {
            if (option.classList.contains('smail-option--active')) {
                option.classList.remove('smail-option--active');
            }
        });

        if (dataTab) {
            menuSmails.forEach(function(smail) {
                if (smail.attributes['data-tab'].textContent == dataTab) {
                    smail.classList.add('smail-mails--active');
                } else {
                    smail.classList.remove('smail-mails--active');
                }
            });
            menuTabs.forEach(function(x) {  x.classList.remove('smail-sidebar__menu--active') })
            document.querySelector(`.smail-sidebar__menu [data-tab="${ dataTab }"]`).classList.add('smail-sidebar__menu--active');
            if (dataTab == 'smail-mail-trash') {
                const optionDraft = document.querySelector('.smail-option--draft');
                optionDraft.classList.add('smail-option--active');
            }
        }
    }

}

const btnSendResponse = document.querySelector('.smail-send-response')
const messageResponse = document.querySelector('.message-response');

btnResponse.onclick = function(e) {
    e.preventDefault();
    console.log('Abriendo campo para responder')

    this.classList.add('smail-none');
    messageResponse.classList.add('message-response--active');
    btnSendResponse.classList.add('smail-send-response--active');
}

btnSendResponse.onclick = function(e) {
    e.preventDefault();

    const idMail = this.attributes['data-id'].textContent;
   
    console.log(idMail)

    
    if (messageResponse.value == '') {
        alert('Se requiere llenar el campo si desea responder el correo')
    } else {
        
        let date = new Date();
        let today = `${ MONTHS[date.getMonth()] } ${ date.getDate() }, ${ date.getFullYear() }`;
        let currentTime = `${ date.getHours() }:${ date.getMinutes() }`

        const data = {
            id: dataMails.length,
            title: document.querySelector('.mail-title').textContent.trim(),
            user: document.querySelector('.mail-user').textContent.trim(),
            message: messageResponse.value,
            date: today,
            time: currentTime,
            status: 'send',
            responses: [],
            file: ''
        }

        dataMails.push(data)

        RESPONSES.push({ parent: idMail, data })

        countAllMails();

        viewResponses(idMail);

        dropdowns();

        smailToast.textContent = 'El mensaje ha sido enviado';
        smailToast.classList.add('smail-toast--active');
        setTimeout(() => {
            smailToast.classList.remove('smail-toast--active');
        }, 4000);

        const newData = dataMails.filter(function(x) { return x.status == 'send' })
        viewData(newData, 'send', false)

        console.log(data)

        messageResponse.classList.remove('message-response--active');
        messageResponse.value = '';
        btnResponse.classList.remove('smail-none');
        this.classList.remove('smail-send-response--active');
    }
}

function viewResponses(idMail) {

    console.log('Ver las repuestas del correo: ' + idMail)
    const dataResponses = RESPONSES.filter(function(res) { return res.parent == idMail })
    console.log('%cTodas las respuestas', 'color: red; padding: 10px; background: blue;')
    console.log(RESPONSES)
    console.log(`%cRespuestas del correo: ${idMail}`, 'color: red; padding: 10px; background: blue;')
    console.log(dataResponses)

    const smailResponses = document.querySelector('.smail-responses');
    smailResponses.innerHTML = '';
    dataResponses.forEach(function(response) {
        const data = response.data;
   
        smailResponses.innerHTML += `
        <div class="smail-mail-only smail-mt">
            <strong class="mail-user">${ data.user }</strong>
            <div class="smail-flex">
                <div class="mail-date">${ data.date }</div>
                <div class="dropdown">
                    <span class="mail-time">${ data.time }</span> <span class="smail-vert"></span>
                    <div class="dropdown-content" data-delete="${ data.id}">
                        Eliminar
                    </div>
                </div>
            </div>
            <div class="mail-message">${ data.message }</div>
            <div class="mail-file"></div>
        </div>`;
    });
}

// Process tasks
// Tasks
const taskOne = document.querySelector('[data-task="1"]');
const taskOneOne = document.querySelector('.task-1-1');
const taskOneTwo = document.querySelector('.task-1-2');

const taskTwo = document.querySelector('[data-task="2"]');
const taskTwoOne = document.querySelector('.task-2-1');
const taskTwoTwo = document.querySelector('.task-2-2');
const taskTwoThree = document.querySelector('.task-2-3');
const taskTwoFour = document.querySelector('.task-2-4');
const taskTwoFive = document.querySelector('.task-2-5');

const taskThree = document.querySelector('[data-task="3"]');
const taskThreeOne = document.querySelector('.task-3-1');
const taskThreeTwo = document.querySelector('.task-3-2');
const taskThreeThree = document.querySelector('.task-3-3');
const taskThreeFour = document.querySelector('.task-3-4');
const taskThreeFive = document.querySelector('.task-3-5');
const taskThreeSix = document.querySelector('.task-3-6');
const taskThreeSeven = document.querySelector('.task-3-7');
const taskThreeEight = document.querySelector('.task-3-8');
const taskThreeNine = document.querySelector('.task-3-9');
const taskThreeZero = document.querySelector('.task-3-0');

function tasks() {
    
    // Tasks One
    const mailsNoRead = document.querySelectorAll('[data-tab="smail-input"] .smail-mail--no-read');

    if (mailsNoRead.length == 0) {
        taskOneOne.classList.add('smail-bold');
    }
    if (dataMails.filter(function(x) { return x.status == 'delete' }).length > 0) {
        taskOneTwo.classList.add('smail-bold');
        taskOne.classList.add('smail-task--active');
    }

    // Task Two
    const mailAna = document.querySelector('[data-tab="smail-input"] .smail-mail[data-mail="1"]')
    const buttonResponseAna = document.querySelector('.smail-btn.smail-response[data-id="1"]')
    const messageAna = document.querySelector('.smail-mail-content.smail-mail-content--active[id="1"] textarea')
    
    if (!mailAna.classList.contains('smail-mail--no-read')) {
        taskTwoOne.classList.add('smail-bold');
    }
    if (buttonResponseAna) {
        if (buttonResponseAna.classList.contains('smail-none')) {
            taskTwoTwo.classList.add('smail-bold');
        }
    }
    if (messageAna) {
        if (messageAna.value != '') {
            taskTwoThree.classList.add('smail-bold');
        }
    }
    if (RESPONSES.filter(function(x) { return x.parent == 1 }).length > 0) {
        taskTwoFour.classList.add('smail-bold');
        taskTwoFive.classList.add('smail-bold');

        taskTwo.classList.add('smail-task--active')
    }
    

    // Task Three
    const newMailClick = document.querySelector('.smail-main-new');
    const fieldTo = document.querySelector('input[name="to"]');
    const fieldTitle = document.querySelector('input[name="title"]');
    const fieldMessage = document.querySelector('textarea[name="message"]');
    const iconClip = document.querySelector('.smail-main-modal');
    const attachCurrent = document.querySelector('.smail-archive div');

    if (newMailClick.classList.contains('smail-main-new--active')) {
        taskThreeOne.classList.add('smail-bold');
    }
    if (fieldTo.value != '' && fieldTo.value == 'hr@somecompany.com') {
        taskThreeTwo.classList.add('smail-bold');
        taskThreeThree.classList.add('smail-bold');
    }
    if (fieldTitle.value != '') {
        taskThreeFour.classList.add('smail-bold');
        taskThreeFive.classList.add('smail-bold');
    }
    if (fieldMessage.value != '') {
        taskThreeSix.classList.add('smail-bold');
        taskThreeSeven.classList.add('smail-bold');
    }
    if (iconClip.classList.contains('smail-main-modal--active')) {
        taskThreeEight.classList.add('smail-bold');
        taskThreeNine.classList.add('smail-bold');
    }
    if (attachCurrent) {
        if (attachCurrent.children[0].textContent.trim() == 'CV.pdf') {
            taskThreeZero.classList.add('smail-bold');
            taskThree.classList.add('smail-task--active');
        }
    }
}

window.addEventListener('mousemove', tasks);
window.addEventListener('touchmove', tasks);
