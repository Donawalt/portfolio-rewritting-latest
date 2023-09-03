import fs from 'fs/promises';

export async function getImageSizeClient(src) {

    const response = await fetch(src);
    const buffer = await response.arrayBuffer();

    if (buffer[0] != 0xFF || buffer[1] != 0xD8) {
        throw new Error('Not a valid JPEG image');
    }

    let pos = 2;
    const dataView = new DataView(buffer);

    while (pos < buffer.byteLength) {
        if (buffer[pos] != 0xFF) {
            pos++;
            continue;
        }

        const marker = buffer[pos + 1];
        pos += 2;

        if (marker == 0xC0 || marker == 0xC2) {
            return {
                src,
                width: dataView.getUint16(pos + 5),
                height: dataView.getUint16(pos + 3)
            };
        }

        pos += dataView.getUint16(pos);
    }

    throw new Error('Could not determine JPEG image dimensions');

}
